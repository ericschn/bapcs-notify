import { useState } from 'react';

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { PostList } from './components/PostList';

function App() {
  const [count, setCount] = useState(0);

  return (
      <div className="App">
        <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/new' element={<PostList filter="new"/>} />
          </Routes>

      </div>
  );
}

export default App;
