import React from 'react';
import { UsersProvider } from './context/UsersContext';
import List from './components/List/List';
import Details from './components/Details/Details';
import styles from './App.module.css';

function App() {
  return (
    <UsersProvider>
      <div className={styles.app}>
        <List />
        <Details />
      </div>
    </UsersProvider>
  );
}

export default App;