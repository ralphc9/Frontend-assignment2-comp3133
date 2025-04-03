import { gql } from 'apollo-angular';

export const GET_EMPLOYEES = gql`
  query getEmployees {
    getEmployees {
      id
      firstName
      lastName
      email
      gender
      salary
      position
      department
      profilePicture
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query getEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      firstName
      lastName
      email
      gender
      salary
      position
      department
      profilePicture
    }
  }
`;

export const SEARCH_EMPLOYEES = gql`
  query searchEmployees($department: String, $position: String) {
    searchEmployees(department: $department, position: $position) {
      id
      firstName
      lastName
      email
      gender
      salary
      position
      department
      profilePicture
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $firstName: String!
    $lastName: String!
    $email: String!
    $gender: String
    $salary: Float
    $position: String
    $department: String
    $profilePicture: String
  ) {
    addEmployee(
      firstName: $firstName
      lastName: $lastName
      email: $email
      gender: $gender
      salary: $salary
      position: $position
      department: $department
      profilePicture: $profilePicture
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation updateEmployee(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $gender: String
    $salary: Float
    $position: String
    $department: String
    $profilePicture: String
  ) {
    updateEmployee(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      gender: $gender
      salary: $salary
      position: $position
      department: $department
      profilePicture: $profilePicture
    ) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      id
    }
  }
`;