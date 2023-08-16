import { gql } from '@apollo/client';

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      id
      name
      price
      quantity
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      price
      quantity
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $price: Float!, $quantity: Int!) {
    createProduct(name: $name, price: $price, quantity: $quantity) {
      id
      name
      price
      quantity
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $name: String, $price: Float, $quantity: Int) {
    updateProduct(id: $id, name: $name, price: $price, quantity: $quantity) {
      id
      name
      price
      quantity
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;
