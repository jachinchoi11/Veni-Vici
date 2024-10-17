
import { useState } from 'react'
import { useEffect } from 'react'
import React from 'react';

function Card() {
  const [showComponent, setshowComponent] = useState(false);
  const[data, setData] = useState(null);
  const[bannedItems, setbannedItems] = useState(new Set());

  const banList= (attribute) => {
    setbannedItems((prevSet) => new Set(prevSet).add(attribute)); 
  }
  useEffect (() => {
    if (showComponent) {
        console.log("component shown");
    }
}, [showComponent]);


  const fetchData = async () => {
    try {
      const response = await fetch('https://api.thedogapi.com/v1/images/search?api_key=live_hOt530hP4ERSqMviAfWb7ewP4HoOk2xrZpciWiCgQD9Rl0pvqQjnOqvNJxLS9BAx');
      const data = await response.json();
      if (data[0]?.breeds?.length > 0) {
        const name = data[0].breeds[0].name;
        const lifeSpan = data[0].breeds[0].life_span;
        const temperament = data[0].breeds[0].temperament;

        if (bannedItems.has(name)
        || bannedItems.has(lifeSpan)
        || bannedItems.has(temperament)) {
            console.log('Dog in ban list, fetching again')
            fetchData();
        } 
        else {
            setData(data);
            setshowComponent(true);
        }
        
      }
      else {
        console.log('No breed info, fetching again')
        fetchData();
      }

      console.log(data);

    }
    catch {
      console.log("Error")
    }
}
  return (
    <>
    <div>
        {showComponent && data && (
          <div>
            <h1>Dog Image</h1>
            <img src={data[0]?.url} alt="A dog" width="300" />
                <div>
                    <button onClick={() => banList(data[0].breeds[0].name)}>Breed: {data[0].breeds[0].name}</button>
                    <button onClick = {() => banList(data[0].breeds[0].life_span)}>Life span: {data[0].breeds[0].life_span}</button>
                    <button onClick = {() => banList(data[0].breeds[0].temperament)}>Temperament: {data[0].breeds[0].temperament}</button>
                </div>
          </div>
        )}
      <button onClick = {fetchData}>Fetch Dog</button>
      </div>
      <div>
        <h2>Ban List</h2>
        <ul>
            {[...bannedItems].map((value, index) => (
                <li key = {index}>{value}</li>
            )
            )}
        </ul>
      </div>
    </>
  );
}


export default Card;
