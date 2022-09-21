import React, { Suspense } from 'react';
import useSound from 'use-sound';
import minecraftItems from 'minecraft-items';
import axios from 'axios';

import { useMousePosition } from "../utils/useMousePosition";

import FullHeart from '../components/fullHeart';
import EmptyHeart from '../components/emptyHeart';

// import portail_du_nether from '../sounds/portail-du-nether.mp3';
// import button_sound from '../sounds/button_sound.mp3';
// import damage_sound from '../sounds/hitsound.wav';
// import Bow_Ding from '../sounds/Bow_Ding.wav';

import { FaArrowLeft } from "react-icons/fa";
import { ImArrowRight } from "react-icons/im";
import { FaHammer } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { FcCancel } from "react-icons/fc";
import { ImVolumeDecrease } from "react-icons/im";
import { ImVolumeIncrease } from "react-icons/im";

const Spline = React.lazy(() => import('@splinetool/react-spline')); 


function fyShuffle(arr) {
  let i = arr.length;
  while (--i > 0) {
    let randIndex = Math.floor(Math.random() * (i + 1));
    [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
  }
  return arr;
}


function getItemIcon(itemName) {
  try {
    return minecraftItems.find(itemName)[0].icon;
  }catch(e) {
    return null;
  }
}



function Loading() {
  return (
    <div className="hero-text">
      <h1 style={{fontSize: "50px"}}>Loading . . . </h1>
    </div>
  )
}


export default function App( { recipeIndex, recipeInventory } ) {

  const [ dayRecipe, setDayRecipe ] = React.useState(recipeIndex);
  const [ inventory , setInventory ] = React.useState(null);
  const [ itemSelected , setItemSelected ] = React.useState(null);
  const [ hoverText , setHoverText ] = React.useState(null);
  
  const [ craftingTable, setCraftingTable ] = React.useState( null );

  const [ gameResume, setGameResume ] = React.useState( null );
  
  const [ loading, setLoading ] = React.useState(true);
  const [ menuUI, setMenuUI ] = React.useState('main');
  const [ background, setBackground ] = React.useState( null );
  const [ volume, setVolume ] = React.useState( null );
  
  const position = useMousePosition();
  // const [play_portal] = useSound( portail_du_nether, { sprite: { play: [0, 8000] }, volume: ((volume / 100)/50)  } );
  // const [play] = useSound( button_sound, { sprite: { play: [200, 500] }, volume: (volume / 100)  } );
  // const [play_damage] = useSound( damage_sound, { volume: ((volume / 100)/10) } );
  // // const [play_success_sound] = useSound( Bow_Ding, { volume: (volume / 100) } );
  // const [play_success_sound] = useSound( damage_sound, { volume: (volume / 100) } );
  
  React.useEffect(() => {

    // get background and volume from localstorage
    setBackground( localStorage.getItem('background') || 'performance' );
    setVolume( parseInt(localStorage.getItem('volume')) || 50 );

    console.log('volume: ', volume);

    let craftingArray = [];
    for(let i = 0; i < 9; i++) {
      craftingArray.push({
        id: 'empty' + (Math.random() * 100).toString() ,
        name: 'empty',
        quantity: 0,
        image: 'empty'
      });
    }
    setCraftingTable( craftingArray );

    const localGameResume = JSON.parse(localStorage.getItem('gameResume'));

    if( localGameResume && localGameResume.dayRecipeName === recipeIndex ) {
      setGameResume( localGameResume );
    } else {
      // console.log("no local resume or different recipe");
      //reset the gameResume object
      setGameResume({
        gameOver: false,
        gameWon: false,
        heartsAmount: 8,
        dayRecipeName: recipeIndex, 
        craftingsTrys: []
      });
    }


    
    // console.log("recipeIndex: ", recipeIndex);
      let parsedData = [];
      recipeInventory.forEach( item => {
          parsedData.push( {
            id: item.name + (Math.random() * 100).toString(),
            name: item.name,
            quantity: Math.floor(Math.random() * (49 - 15 + 1) + 15),
            image: item.image
          });
      });


      for( let i = 0; i < 27 - recipeInventory.length; i++ ) {
        parsedData.push({
          id: 'empty' + (Math.random() * 100).toString() ,
          name: 'empty',
          quantity: 0,
          image: 'empty'
        });
      }

      fyShuffle(parsedData);

      setInventory(parsedData);
      // console.log("parsedData: ", parsedData);
      setLoading(false);


    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    localStorage.setItem("background", background);
    // eslint-disable-next-line
  } , [background]);

  React.useEffect(() => {
    localStorage.setItem("volume", volume);
    // eslint-disable-next-line
  } , [volume]);

  React.useEffect(() => {
    localStorage.setItem("gameResume", JSON.stringify(gameResume));
    // eslint-disable-next-line
  } , [gameResume]);

  const handlePlayButton = () => {
    // console.log( "gameOver: ", gameResume );
    // play({id: 'play'}); 
    setLoading(true); 
    // play_portal({id: 'play'});
    setTimeout(() => {
      //check if the game is over or not
      if( gameResume.gameOver ){
        setMenuUI('gameOver');
      } else {
        setMenuUI('crafteadle');
      }
      setLoading(false);
    }, 4000);
  }

  const handleVolumeDecrease = () => {
    try {
      // play({id: 'play'});
      if(volume >= 10) setVolume( pValue => pValue - 10 ) ;
    } catch (error) {
      console.log(error);
    }
  }
  const handleVolumeIncrease = () => {
    try {
      play({id: 'play'});
      if(volume <= 90) {
        setVolume( (pValue) => (pValue + 10) )
      } ;
    } catch (error) {
      console.log(error.message);
    }
  }


  const handleItemHover = (event, itemID) => {
    let saveInventory = [...inventory];
    const index = saveInventory.findIndex(i => i.id === itemID);
    let item = {...saveInventory[index]};
    setHoverText( item.name !== 'empty' ? item.name : null );
  }

  const handleItemClick = (event, itemId) => {

    if( itemSelected ) {
      let newInventory = [...inventory];
      const itemSelectedSaved = {...itemSelected};
      const index = newInventory.findIndex(i => i.id === itemId);
      let itemToChange = {...newInventory[index]};
      setItemSelected(null);

      if( itemSelected.lastIndex === index ) {
        newInventory[itemSelectedSaved.lastIndex] = {
          id: itemSelectedSaved.id,
          name: itemSelectedSaved.name,
          quantity: itemSelectedSaved.quantity,
          image: itemSelectedSaved.image
        };
        setInventory(newInventory);
        return;
      }

      //change the selected item to the itemToChange
      // console.log("index: ", index ,"\nitem to change: " , itemToChange, "\nitemSelectedSaved.lastIndex: ", itemSelectedSaved.lastIndex, "\nitemSelectedSaved: ", itemSelectedSaved);
      newInventory[index] = {
        id: itemSelectedSaved.id,
        name: itemSelectedSaved.name,
        quantity: itemSelectedSaved.quantity,
        image: itemSelectedSaved.image
      };
      //change the empty itemToChange to the selected one
      newInventory[itemSelectedSaved.lastIndex] = {
        id: itemToChange.id,
        name: itemToChange.name,
        quantity: itemToChange.quantity,
        image: itemToChange.image
      };

      setInventory(newInventory);
      return;
    }



    const item = inventory.find(item => item.id === itemId);
    if( item.name === 'empty' ) {
      return;
    }
    let newInventory = [...inventory];
    let index = newInventory.findIndex(i => i.id === item.id);
    item.lastIndex = index;
    setItemSelected(item);

    newInventory[index] = {
      id: 'empty',
      name: 'empty',
      quantity: 0,
      image: 'empty'
    };

    setInventory(newInventory);
  }

  const handleCraftingTableItems = (e, slotID) => { //function to handle the crafting table items
    // console.log(craftingTable, slotID);
    if( itemSelected ) {

      if( craftingTable[ craftingTable.findIndex(item => item.id === slotID) ].name !== "empty" && craftingTable[ craftingTable.findIndex(item => item.id === slotID) ].name !== itemSelected.name ) {

        let newInventory = [...inventory];
        const itemSelectedSaved = {...itemSelected};
        setItemSelected(null);

        let newCraftingTable = [...craftingTable];
  
        let itemCraftingTable = {...newCraftingTable[ newCraftingTable.findIndex(item => item.id === slotID) ]};  //item to be removed from the crafting table
        let itemInventory = {...newInventory[ newInventory.findIndex( item => item.name === itemCraftingTable.name ) ]};  //item to be removed from the crafting table
  
        newCraftingTable[newCraftingTable.findIndex(item => item.id === slotID)] = {
          id: slotID,
          name: 'empty',
          quantity: 0,
          image: 'empty'
        };
  
        newInventory[newInventory.findIndex( item => item.name === itemCraftingTable.name )] = {
          ...itemInventory, quantity: itemInventory.quantity + 1
        };

        setCraftingTable(
          prevCraftingTable => {
            let newCraftingTable = [...prevCraftingTable];
            newCraftingTable[ prevCraftingTable.findIndex(
              item => item.id === slotID
            ) ] = {
              id: slotID,
              name: itemSelectedSaved.name,
              quantity: 1,
              image: itemSelectedSaved.image
            };
            // console.log("newCraftingTable: ", newCraftingTable);
            return newCraftingTable;
          }
        );
  
        newInventory[itemSelectedSaved.lastIndex] = {
          ...itemSelectedSaved, quantity: itemSelectedSaved.quantity - 1
        };
  
        setInventory(newInventory);
        return;
      } else if ( craftingTable[ craftingTable.findIndex(item => item.id === slotID) ].name !== "empty" && craftingTable[ craftingTable.findIndex(item => item.id === slotID) ].name === itemSelected.name  ) {

        setHoverText("You can't put the same item in the same slot");

        setTimeout(() => {
          setHoverText(null);
        } , 2000);

        return;

      } else {

        let newInventory = [...inventory];
        const itemSelectedSaved = {...itemSelected};

        setCraftingTable(
          prevCraftingTable => {
            let newCraftingTable = [...prevCraftingTable];
            newCraftingTable[ prevCraftingTable.findIndex(
              item => item.id === slotID
            ) ] = {
              id: slotID,
              name: itemSelectedSaved.name,
              quantity: 1,
              image: itemSelectedSaved.image
            };
            // console.log("newCraftingTable: ", newCraftingTable);
            return newCraftingTable;
          }
        );
        
        //devuelve el item seleccionado al inventario con -1 de cantidad
        // newInventory[itemSelectedSaved.lastIndex] = {
        //   ...itemSelectedSaved, quantity: itemSelectedSaved.quantity - 1
        // };

        setItemSelected(
          prevItemSelected => {
            let newItemSelected = {...prevItemSelected};
            newItemSelected.quantity = prevItemSelected.quantity - 1;
            return newItemSelected;
          }
        );


        setInventory(newInventory);
        return;
      }
    
    } else if( craftingTable[ craftingTable.findIndex(item => item.id === slotID) ].name !== "empty" ) {

      let newInventory = [...inventory];
      let newCraftingTable = [...craftingTable];

      let itemCraftingTable = {...newCraftingTable[ newCraftingTable.findIndex(item => item.id === slotID) ]};  //item to be removed from the crafting table
      let itemInventory = {...newInventory[ newInventory.findIndex( item => item.name === itemCraftingTable.name ) ]};  //item to be removed from the crafting table

      newCraftingTable[newCraftingTable.findIndex(item => item.id === slotID)] = {
        id: slotID,
        name: 'empty',
        quantity: 0,
        image: 'empty'
      };
      setCraftingTable(newCraftingTable);

      newInventory[newInventory.findIndex( item => item.name === itemCraftingTable.name )] = {
        ...itemInventory, quantity: itemInventory.quantity + 1
      };
      setInventory(newInventory);
      return;
    }else{

      return;
    }
  }

  const handleCraftingButton = async () => { //function to handle the crafting button
    
    // console.log(craftingTable.every( item => item.name !== "empty" ));
    if ( craftingTable.every( item => item.name === "empty" ) ){

      setHoverText("You can't craft an empty table");

      setTimeout(() => {
        setHoverText(null);
      } , 5000);

      return;

    }else{
      let craftingTablePattern = [];
      let newCraftingTable = [...craftingTable];
      //create a pattern of the crafting table items
      for( let i = 0; i < 3; i++ ){
      let row = [];
      for( let j = 0; j < 3; j++ ){
          row.push(newCraftingTable[i * 3 + j].name);
      }
      craftingTablePattern.push(row);
      }

      //remove the empty rows from the pattern
      craftingTablePattern = craftingTablePattern.filter( (row,i) => row.some( item => item !== "empty" ) );
      //remove the empty cols from the pattern if all are empty
      for( let i = 0; i < 1; i++ ){
      if( craftingTablePattern.length === 3 ){
          if( craftingTablePattern[i][0] === "empty" && craftingTablePattern[i+1][0] === "empty" && craftingTablePattern[i+2][0] === "empty" ){
          craftingTablePattern[i].shift();
          craftingTablePattern[i+1].shift();
          craftingTablePattern[i+2].shift();
          if( craftingTablePattern[i][1] === "empty" && craftingTablePattern[i+1][1] === "empty" && craftingTablePattern[i+2][1] === "empty" ){
              craftingTablePattern[i].pop();
              craftingTablePattern[i+1].pop();
              craftingTablePattern[i+2].pop();
          }
          } else if( craftingTablePattern[i][2] === "empty" && craftingTablePattern[i+1][2] === "empty" && craftingTablePattern[i+2][2] === "empty" ){
          craftingTablePattern[i].pop();
          craftingTablePattern[i+1].pop();
          craftingTablePattern[i+2].pop();
          }    
      } else if( craftingTablePattern.length === 2 ){
          if( craftingTablePattern[i][0] === "empty" && craftingTablePattern[i+1][0] === "empty" ){
          craftingTablePattern[i].shift();
          craftingTablePattern[i+1].shift();
          if( craftingTablePattern[i][1] === "empty" && craftingTablePattern[i+1][1] === "empty" ){
              craftingTablePattern[i].pop();
              craftingTablePattern[i+1].pop();
          }
          } else if( craftingTablePattern[i][2] === "empty" && craftingTablePattern[i+1][2] === "empty" ){
          craftingTablePattern[i].pop();
          craftingTablePattern[i+1].pop();
          }    
      } else if( craftingTablePattern.length === 1 ){
          if( craftingTablePattern[i][0] === "empty" ){
          craftingTablePattern[i].shift();
          } else if( craftingTablePattern[i][2] === "empty" ){
          craftingTablePattern[i].pop();
          }    
      }
      }
      
      const res = await axios.post('/api/checkCraftingRecipe', { recipeIndex , craftingTable: craftingTablePattern });
      
      //check if the crafting table pattern matches the recipe pattern
      if( res.status === 200 && res.data.success ) {
        
        setTimeout(() => {
          // play_success_sound();
        } , 1000);

        setHoverText("You crafted the recipe");

        setTimeout(() => {
          setHoverText(null);
          setDayRecipe(res.data.recipe.result.item);
          setGameResume(
            prevGameResume => {
              let newGameResume = {...prevGameResume};
              newGameResume.gameOver = true;
              newGameResume.gameWon = true;
              newGameResume.craftingsTrys.push( [...craftingTable] );
              return newGameResume;
            }
          );
          setMenuUI( "gameOver" );
        } , 3000);

        //show the crafting animation and change to the game resume 
      }else{
        // console.log("Pattern doesn't match");
        setHoverText("Wrong pattern, try again");

        let fullHeartsArray = document.querySelectorAll("#fullHeart");
        // remove the hearts from the player with animation
        fullHeartsArray.forEach( heart => {
          heart.classList.add("img-pulse-animation");
        } );
        setTimeout(() => {
          fullHeartsArray.forEach( heart => {
            heart.classList.remove("img-pulse-animation");
          } );
        } , 1000);

        fullHeartsArray[fullHeartsArray.length - 1].parentNode.children[0].style.display = "block";
        fullHeartsArray[fullHeartsArray.length - 1].parentNode.children[0].classList.add("brokenHeart_line");
        setTimeout(() => {
          // play_damage();
        } , 1000);

        fullHeartsArray[fullHeartsArray.length - 1].parentNode.children[1].style.display = "block";
        // console.log(fullHeartsArray[fullHeartsArray.length - 1].parentNode.children[1].children);
        Object.entries(fullHeartsArray[fullHeartsArray.length - 1].parentNode.children[1].children).forEach( pixels => {
          // console.log(pixels[1]);
          pixels[1].classList.add("brokenHeart_pixels");
        });

        setTimeout(() => {
          const heartsAvailable = gameResume.heartsAmount - 1;
          if ( heartsAvailable === 0 ) {
            const res2 = axios.get('/api/getDayRecipeName');
            setDayRecipe(res2.data.recipeName);
            setGameResume(
              prevGameResume => {
                let newGameResume = {...prevGameResume};
                newGameResume.gameOver = true;
                newGameResume.gameWon = false;
                newGameResume.heartsAmount = heartsAvailable;
                newGameResume.craftingsTrys.push( [...craftingTable] );
                return newGameResume;
              }
            );
            setMenuUI( "gameOver" );
          } else {
            setGameResume(
              prevGameResume => {
                let newGameResume = {...prevGameResume};
                newGameResume.heartsAmount = heartsAvailable;
                newGameResume.craftingsTrys.push( [...craftingTable] );
                return newGameResume;
              }
            );
          }
        } , 1100);

        setTimeout(() => {
          setHoverText(null);
        } , 5000);
        return;
      }

      }
  }
  
  
  return (
    <>
      {loading ?  
        <Loading className="text-5xl" />
      : 
        <div className="MainPage h-screen">
        <Suspense fallback={ <Loading /> }>
        { menuUI === 'main' && 
          <>
          <h1
            className="text-8xl md:text-9xl"
            style={{
              position: "absolute",
              marginTop: "10px",
              width: "100vw"
            }} >
            CRAFTEADLE
          </h1>
          <button
            onClick={() => { handlePlayButton();}}
            style={{position: "absolute", left: "50%", top: "40%", transform: "translate(-50%, -50%)"}} 
            className="py-0 text-3xl minecraft-btn mx-auto w-64 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200">Play Crafteadle</button>
            
            <button
            onClick={() => { 
              play({id: 'play'});
              setBackground('performance'); }}
            style={{transform: "translate(-50%, -50%)"}}
                className={`absolute top-[50%] left-[68%] md:left-[56%] py-0 text-3xl minecraft-btn mx-auto w-36 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200 ${background === "performance" ? "opacity-50" : ""}`}>
              Performance
            </button>
            <button
              onClick={() => { 
                play({id: 'play'});
                setBackground('quality'); }}
              style={{transform: "translate(-50%, -50%)"}}
              className={`absolute top-[50%] left-[33%] md:left-[44%] py-0 text-3xl minecraft-btn mx-auto w-36 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200 ${background === "quality" ? "opacity-50" : ""}`}>
              Quality
            </button>
            <div className="relative top-[60%]">            
              <button
                onClick={() => { handleVolumeDecrease();}}
                style={{transform: "translate(-50%, -50%)"}} 
                className="absolute top-[60%] left-[25%] md:left-[43%] py-0 text-3xl minecraft-btn mx-auto w-10 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200">
                <ImVolumeDecrease />
              </button>
                <button
                  // onClick={() => { play({id: 'play'}) }}
                  style={{transform: "translate(-50%, -50%)"}}
                  className="absolute top-[60%] left-[50%] md:left-[%] py-0 text-3xl minecraft-btn mx-auto w-24 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200">
                  {volume}
                </button>
              <button
                onClick={() => { handleVolumeIncrease();}}
                style={{transform: "translate(-50%, -50%)"}}
                className="absolute top-[60%] left-[75%] md:left-[57%] py-0 text-3xl minecraft-btn mx-auto w-10 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200">
                <ImVolumeIncrease />
              </button>
            </div>
            { background === 'performance' ? 
              <div className="bg-black h-screen w-screen">
                <img src={'/images/Craftdle@1-1366x643.png'} alt="CraftdleBG" className="h-screen w-screen object-cover" />
              </div>
            :
              <Spline
                style={{
                  width: '100%',
                  height: '100vh',
                }} scene="https://prod.spline.design/bpFOIrFYrUwAYuSt/scene.splinecode" />
            }
          </>
        }

        { (menuUI === 'crafteadle' && !gameResume.gameOver ) &&
          <>
            { itemSelected != null &&
              <div className='absolute h-[30px] w-[30px]' id={itemSelected.id} style={{zIndex: "100", cursor: "crosshair", top: position.y+10, left: position.x+10 }}> 
              <img src={itemSelected.image} alt={itemSelected.name} className="" />
              <span className="crafting-text" style={{position: "absolute",fontSize: "22px",color: "white",right: "0%",bottom: "0%",margin: "1px",padding: "0px",height: "22px"}}>{itemSelected.quantity}</span>
            </div>
            }


            <button
              onClick={() => { 
                play({id: 'play'});
                setLoading(true); 
                // play_portal({id: 'play'});
                setTimeout(() => {
                  setMenuUI('main');
                  setLoading(false);
                }, 2000);}
            }
              style={{position: "absolute", left: "25px", top: "25px", transform: "translate(-50%, -50%)"}}
              className="py-0 text-3xl minecraft-btn mx-auto w-10 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200">
              <FaArrowLeft />
            </button>

            <div className="main2">
              <h2 className="crafting-text" style={{fontSize: "2.2em", paddingBottom: "2px"}}>Crafting</h2>
              <div style={{display: "flex", flexDirection: "row", gap: "12px"}}>
                  <div className="boxes-crafting">

                    {
                      craftingTable.map( (item) => (
                        <div key={item.id} className="box-crafting relative" onClick={ (e)=>{ handleCraftingTableItems(e, item.id) } }>
                          {
                            item.quantity !== 0 && 
                            <>
                              <img src={item.image} alt={item.name} className=" w-full h-full object-cover " />
                              {/* <span className="crafting-text" style={{position: "absolute",fontSize: "22px",color: "white",right: "0%",bottom: "0%",margin: "1px",padding: "0px",height: "22px"}}>{item.quantity}</span> */}
                            </>
                          }
                        </div>
                      ))
                    }

                  </div>
                <div style={{paddingTop: "35px", /*margin: "35px 25px" */ }} className="">
                  <button
                    onClick={(e) => {handleCraftingButton(e); }}
                    style={{ height: "50px", width: "50px", /* transform: "translate(-50%, -50%)" */ }}
                    className="py-0 text-4xl minecraft-btn mx-auto w-10 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200">
                      <FaHammer />
                  </button>
                    {/* <div className="box-crafting text-5xl text-center p2 text-gray-100 bg-[#7b4f34] hover:text-gray-400 hover:bg-[#e49359]" style={{ height: "50px", width: "50px", boxShadow: "2px 2px 0 2px #533421, -2px -2px 0 2px #e49359, 0 0 0 4px #6a3f24"}}>
                      

                    </div> */}
                </div>
                <div className="boxes-crafting" style={{ display: "grid", gridTemplateColumns: "42px", gridTemplateRows: "42px", margin: "35px 15px"}}>
                  <div className="box-crafting relative" style={{ height: "50px", width: "50px"}}>
                    <span className='animate-pulse text-7xl absolute top-[-25%] left-[25%]' >?</span>
                  </div>
                </div>
              </div>
            </div>

            
            

          	<div className="main1">
              { hoverText &&
                <h2 style={{fontSize: "1.5em", margin: 0, textAlign: "center" }}>{ hoverText }</h2>
              }
              <div className="boxes2" style={{ marginTop: hoverText ? "0px" : "30px" }}>
              {
                inventory.map((item, index) => {
                  // console.log(inventory[index].name);
                  return (
                    <div className="box relative" key={item.id}
                      onClick={ (event) => { handleItemClick(event, item.id) } }
                      onMouseEnter={ (event) => { handleItemHover(event, item.id) } }
                    >
                        {
                          item.name !== 'empty' ?
                          <div id={item.id} style={{cursor: "crosshair"}} >
                            <img src={item.image} alt={item.name} className="" />
                            <span className="crafting-text" style={{position: "absolute",fontSize: "22px",color: "white",right: "0%",bottom: "0%",margin: "1px",padding: "0px",height: "22px"}}>{item.quantity}</span>
                          </div>
                          :
                          <div id={item.id} style={{cursor: "crosshair"}}>
                          </div>
                        }
                    </div>
                  )
                })
              }
              </div>

              <div className="flex flex-row gap-[1.4rem] justify-center pb-2">
                { gameResume.heartsAmount >= 1 ? <FullHeart /> : <EmptyHeart /> }
                { gameResume.heartsAmount >= 2 ? <FullHeart /> : <EmptyHeart /> }
                { gameResume.heartsAmount >= 3 ? <FullHeart /> : <EmptyHeart /> }
                { gameResume.heartsAmount >= 4 ? <FullHeart /> : <EmptyHeart /> }
                { gameResume.heartsAmount >= 5 ? <FullHeart /> : <EmptyHeart /> }
                { gameResume.heartsAmount >= 6 ? <FullHeart /> : <EmptyHeart /> }
                { gameResume.heartsAmount >= 7 ? <FullHeart /> : <EmptyHeart /> }
                { gameResume.heartsAmount >= 8 ? <FullHeart /> : <EmptyHeart /> }
              </div>

            </div> 

              { background === 'performance' ? 
              <div className="bg-black h-screen w-screen">
                <img src={'/images/Untitled@1-1366x643.png'} alt="CraftdleBG" className="h-screen w-screen object-cover" />
              </div>
              :
              <Spline style={{
                  width: '100%',
                  height: '100vh',
                }} scene="https://prod.spline.design/gYpek3Yu9me-G5M0/scene.splinecode" />
              }
          </>
        }
        { menuUI === "gameOver" && ( gameResume.gameOver && gameResume.gameWon ) &&
          <>
                <div className="flex flex-col gap-4 ">
                  <h2 className="text-center text-white text-5xl">You win!</h2>
                  <h2 className="text-center text-white text-3xl">Item of the day {dayRecipe}</h2>
                  <h2 className="text-center text-white text-3xl">{gameResume.craftingsTrys.length} trys to won</h2>
                  {
                    gameResume.craftingsTrys.map((tables, index) => (
                      
                        
                      
                          <div key={index+"table"} className="main3">
                          <h2 className="crafting-text" style={{fontSize: "2.2em", paddingBottom: "2px"}}>Crafting try #{index+1}</h2>
                          <div style={{display: "flex", flexDirection: "row", gap: "12px", paddingBottom: "15px"}}>
                              <div className="boxes-crafting" style={{ marginBottom: "0px", paddingBottom: "0px"}}>
            
                                {
                                  tables.map( (item, index) => (
                                    <div key={item.id + index} className="box-crafting relative" >
                                      {
                                        item.name !== "empty" &&
                                        <>
                                          <img src={item.image} alt={item.name} className="w-[95%] h-[95%] object-cover" />
                                        </>
                                      }
                                    </div>
                                  ))
                                }
            
                              </div>
                            <div style={{ width: "48px", height: "48px", color: "#583723", marginBottom: "auto", marginTop: "auto" }} className="">
                              <ImArrowRight className="w-full h-full object-cover text-5xl" />
                            </div>
                            <div className="boxes-crafting" style={{ display: "grid", gridTemplateColumns: "42px", gridTemplateRows: "42px", margin: "35px 15px"}}>
                              <div className="box-crafting relative" style={{ height: "50px", width: "50px"}}>
                                <span className='animate-pulse text-7xl' >{ 
                                  index === gameResume.craftingsTrys.length - 1 
                                  ? 
                                    (
                                      dayRecipe.icon ? 
                                      <img src={"data:image/png;base64, "+dayRecipe.icon} alt="win" className="w-[95%] h-[95%] object-cover" />
                                      :
                                      <FcCheckmark className="w-full h-full object-cover" /> 
                                    )
                                  : 
                                    <FcCancel className="w-full h-full object-cover" /> 
                                }</span>
                              </div>
                            </div>
                          </div>
                          </div>
                        
                      
                    ))
                  }
                </div>
          </>        
        }
        { menuUI === "gameOver" && ( gameResume.gameOver && !gameResume.gameWon ) &&
          <>
        <div className="flex flex-col gap-4 ">
          <h2 className="text-center text-white text-5xl">You lost!</h2>
          <h2 className="text-center text-white text-3xl">Item of the day {dayRecipe.result.item}</h2>
          <h2 className="text-center text-white text-3xl">{gameResume.craftingsTrys.length} recipes tried</h2>
          {
            gameResume.craftingsTrys.map((tables, index) => (
              
                
              
                  <div key={index+"table"} className="main3">
                  <h2 className="crafting-text" style={{fontSize: "2.2em", paddingBottom: "2px"}}>Crafting try #{index+1}</h2>
                  <div style={{display: "flex", flexDirection: "row", gap: "12px", paddingBottom: "15px"}}>
                      <div className="boxes-crafting" style={{ marginBottom: "0px", paddingBottom: "0px"}}>
    
                        {
                          tables.map( (item, index) => (
                            <div key={item.id + index} className="box-crafting relative" >
                              {
                                item.name !== "empty" &&
                                <>
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </>
                              }
                            </div>
                          ))
                        }
    
                      </div>
                    <div style={{ width: "48px", height: "48px", color: "#583723", marginBottom: "auto", marginTop: "auto" }} className="">
                      <ImArrowRight className="w-full h-full object-cover text-5xl" />
                    </div>
                    <div className="boxes-crafting" style={{ display: "grid", gridTemplateColumns: "42px", gridTemplateRows: "42px", margin: "35px 15px"}}>
                      <div className="box-crafting relative" style={{ height: "50px", width: "50px"}}>
                        <span className='animate-pulse text-7xl' >{ <FcCancel className="w-full h-full object-cover" /> }</span>
                      </div>
                    </div>
                  </div>
                  </div>
                
              
            ))
          }
        </div>
          </>
        }
        </Suspense>
        </div>
      }
    </>
  );
}


import recipesData from "../data/output.json";
import inventoriesData from "../data/inventories.json";
import items from "../data/items.json";

const getImage = async (name) => {
  const item = await items.find((item) => item.name === name);
  return item.image;
};



export const getServerSideProps = async () => {
  
  console.time("start");
  const date = new Date();
  const index = date.getUTCDate()+date.getUTCMonth()+(date.getUTCMonth()*30)+date.getUTCDate();
  let recipeInventory = [];
  
  for (let i = 0; i < inventoriesData[index].length; i++) {
    const inventory = inventoriesData[index][i];
    recipeInventory.push({
      name: inventory,
      image: await getImage(inventory)
    });
  }


  console.log(recipesData[index],'\n',recipeInventory);
  console.timeEnd("start");

  return {
    props: {
      recipeIndex: index,
      recipeInventory,
    }
  }

}