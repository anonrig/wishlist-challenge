import React, { Component } from 'react';
import API from './lib/api';

import {Header, Image, Table, Button, Search} from 'semantic-ui-react'

class App extends Component {
  state = {
    items: [],
    isSearchLoading: false,
    isDeleting: false,
    searchResult: [],
    searchKeyword: ''
  }

  getAllItems() {
    API
      .getAllItems()
      .then(items => this.setState({items, isDeleting: false}))
      .catch((error) => {
        console.warn('Error occurred while fetching', error);
      });
  }

  componentWillMount() {
    this.getAllItems();
  }

  add(payload) {
    this.setState({searchKeyword: ''}, () => {
      API
        .add(payload)
        .then(() => this.getAllItems())
        .catch((error) => {
          console.warn('Error occurred while adding', error);
        });
    });
  }

  search(keyword) {
    if (!keyword || !keyword.length) {
      return;
    }

    this.setState({searchKeyword: keyword}, () => {
      API
        .search(keyword)
        .then((searchResult) => {
          this.setState({
            searchResult: searchResult.map(result => ({
              title: result.suggestion,
              description: result.subTitle,
              price: `${result.standardPrice}`,
              image: result.image,
              data: result
            }))
          })
        })
        .catch((error) => {
          console.warn('Error occurred while searching', error);
        });
    });
  }

  remove(id) {
    this.setState({isDeleting: true}, () => {
      API
        .remove(id)
        .then(() => this.getAllItems())
        .catch((error) => {
          console.warn('Error occurred while removing', error);
        });
    });
  }

  renderSearch() {
    const {isSearchLoading, searchResult, searchKeyword} = this.state;

    return (
      <Search
        className="search-input"
        loading={isSearchLoading}
        onResultSelect={(event, {result}) => this.add(result.data)}
        onSearchChange={(e, {value}) => this.search(value)}
        results={searchResult}
        value={searchKeyword}
      />
    );
  }

  renderTable() {
    const {items, isDeleting} = this.state;

    if (!items.length) {
      return null;
    }

    return (
      <Table basic='very' celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            items.map(item => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src={item.image} rounded size='mini' />
                    <Header.Content>
                        {item.suggestion}
                      <Header.Subheader>{item.subtitle}</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                    {item.standardPrice}
                </Table.Cell>
                <Table.Cell>
                  <Button negative onClick={() => this.remove(item.id)} loading={isDeleting}>
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
    </Table>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wishlist</h1>
        </header>
        {this.renderSearch()}
        {this.renderTable()}
      </div>
    );
  }
}

export default App;
