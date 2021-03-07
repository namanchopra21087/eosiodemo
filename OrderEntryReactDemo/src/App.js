/*
  Order Entry React Demo for EOSIO Training & Certification: AD101

  Import and implement UAL plugins, consumer, and wrapper in this file
*/

import React from 'react';
import { JsonRpc } from 'eosjs';
import OrderEntryApp from './components/orderentry';

import { UALProvider, withUAL } from 'ual-reactjs-renderer';
import {Anchor} from 'ual-anchor';
function App() {
  
  const ourNetwork={
    chainId:"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
    rpcEndpoints:[{protocol:"http",host:"localhost",port:8888}]
  };
  const anchor=new Anchor([ourNetwork],{
    appName:'OrderEntryApp',
    rpc:new JsonRpc('http://localhost:8888'),
    service:"https://cb.anchor.link",
    disableGreymassFuel:false,
    requestStatus:false
  })
  const OrderEntryAppConsumer=withUAL(OrderEntryApp);
  OrderEntryAppConsumer.displayName="OrderEntryApp";
  return(
    <UALProvider chains={[ourNetwork]} authenticators={[anchor]} appName={'OrderEntryApp'}>
        <OrderEntryAppConsumer/>
    </UALProvider>
  )
}

export default App;
