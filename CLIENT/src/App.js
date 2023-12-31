import './App.css';
import { useState, useEffect} from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { removeFav } from './redux/actions';
import { useDispatch } from 'react-redux';

import axios from 'axios';
import About from './views/About.jsx'
import Error from './views/Error'
import Detail from './views/Detail'
import Cards from './components/Cards.jsx';
import Nav from './components/Nav.jsx';
import Form from './components/Form'
import Favorites from './components/Favorite';

function App() {

   const [characters, setCharacters ] = useState([])
   // const {pathname} = useLocation();
   const dispatch = useDispatch();

   const navigate = useNavigate();
   const [access, setAccess] = useState(true);
  

   async function loginHandler(userData) {
      try {
         const {email, password} = userData;
         const URL = "http://localhost:3001/rickandmorty/login/";
         const {data} = await axios(URL + `?email=${email}&password=${password}`)
         const {access} = data; // true o false
         setAccess(data);
         access && navigate("/home");   
      } catch (error) {
         console.log(error)
      }
      
      }

    useEffect(() => {
         !access && navigate('/')
    },[access]);

   async function onSearch(id) {

      try {
         const response = await axios(`http://localhost:3001/rickandmorty/character/${id}`);
         const data = response.data;
         if (data.name) {
               setCharacters((oldChars) => [...oldChars, data]);
            } else {
               window.alert('¡No hay personajes con este ID!');
            }
         } catch (error) {
         console.log(error)
      }
   }
         

   function closeHandler(id) {
      dispatch(removeFav(id))
      setCharacters(
         characters.filter((char) => {
            return char.id !== Number(id);
               }
            )
      )
      
    }

   return (
   
      <div className='App'>
         {!access ? (
            <Routes>
               <Route path='/' element = {<Form login={loginHandler}/>}/>
               <Route path = '*' element = {<Error/>}/> 
            </Routes>
            )
            : (
               <>
            <Nav onSearch={onSearch} />
            <Routes>
            <Route path='/home' element={<Cards characters={characters} onClose={closeHandler}/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path = '/detail/:id' element = {<Detail/>} />
            <Route path ='/favorites' element={<Favorites/>}/>
            
         </Routes>
         </>
         )}
         
        
      </div>
         
   );
}

export default App;
