/*
  Order Entry React Demo for EOSIO Training & Certification: AD101
  
  Several blocks have been commented out, as they will only
  function as intended when the UAL (Universal Authenticator Library)
  wrapper is implemented in App.js – at which point props will
  contain the ual object. Uncomment (or replace) these lines as
  appropriate.
*/

import * as React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './orderentry.css';
import { JsonRpc } from 'eosjs';
import Table from "../table"

const defaultState = {
  activeUser: null, //to store user object from UAL
  accountName: '', //to store account name of logged in wallet user
  orderItems: '0'
}

class OrderEntryApp extends React.Component {
  static displayName = 'OrderEntryApp';
  userid;
  activeUser=null;
  respData=null;
  data=null;

  constructor(props) {
    super(props)
    const ourNetwork={
      chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
      rpcEndpoints:[{protocol:'http',host:'localhost',port:8888}]
    };
    this.state = {
      ...defaultState,
      rpc:new JsonRpc('http://localhost:8888')
    }
    this.updateAccountName = this.updateAccountName.bind(this)
    this.renderOrderButton = this.renderOrderButton.bind(this)
    this.placeorder = this.placeorder.bind(this)
    this.renderModalButton = this.renderModalButton.bind(this)
    this.handleOrderUpdate = this.handleOrderUpdate.bind(this)
    this.renderOrderForm = this.renderOrderForm.bind(this)
    this.loadTableData = this.loadTableData.bind(this)
  }

  // implement code to transact, using the order details, here
  async placeorder() {
    const { accountName, activeUser, orderItems } = this.state
    console.log("With UAL implemented, this submits an order for items " + orderItems);
    const orderTransaction={
      actions:[{
        account:'bolttech',
        name:'addorder',
        authorization:[{actor:accountName,permission:'active'}],
        data:{
          userid:this.userid+1,
          items:orderItems.split(","),
          status:'Active'
        }
      }]
    }
    try{
      await activeUser.signTransaction(orderTransaction,{broadcast:true});
      this.loadTableData()
      window.location.reload()
    }catch(error){
      console.warn(error);
    }
  }


  renderOrderButton() {
    return (
      <p className='ual-btn-wrapper'>
        <Button variant="outline-warning" onClick={this.placeorder}>
          {'Place Order'}
        </Button>
      </p>
    )
  }


  // once the UAL wrapper is implemented, the code below will function
  
  
  componentDidUpdate() {
    const { ual: { activeUser } } = this.props
    if (activeUser && !this.state.activeUser) {
      this.setState({ activeUser }, this.updateAccountName)
    } else if (!activeUser && this.state.activeUser) {
      this.setState(defaultState)
    }
  }
  
  async updateAccountName()   {
    try {
      const accountName = await this.state.activeUser.getAccountName()
      this.setState({ accountName }, this.updateAccountBalance)
    } catch (e) {
      console.warn(e)
    }
  }

  renderLogoutBtn = () => {
    const { ual: { activeUser, activeAuthenticator, logout } } = this.props
    if (!!activeUser && !!activeAuthenticator) {
      this.activeUser=null;
      return (
        <p className='ual-btn-wrapper'>
          <Button variant='outline-danger' onClick={logout}>
            {'Logout'}
          </Button>
        </p>
      )
    }
  }

  renderModalButton() {
    return (
      <p className='ual-btn-wrapper'>
        <Button variant='outline-primary'
          onClick={this.props.ual.showModal}
          className='ual-generic-button'>Connect to Wallet</Button>
      </p>
    )
  }

  handleOrderUpdate = (event) => {
    this.setState({orderItems: event.target.value});
  }

  renderOrderForm = () => {
    const { orderItems } = this.state
    return(
      <div style={{marginLeft: 'auto', marginRight:'auto', width:'25%', marginTop:'40px', marginBottom:'10px'}}>
        <Form>
          <Form.Group controlId="orderItems">
            <Form.Label>Items to order (comma separated):</Form.Label>
            <Form.Control
                  type="text"
                  name="orderItems"
                  value={orderItems}
                  onChange={this.handleOrderUpdate}
                />
          </Form.Group>
        </Form>
      </div>
    )
  }

  loadTableData () {
    this.state.rpc.get_table_rows({
      json:true,
      code:'bolttech',
      scope:'bolttech',
      table:'orders',
      limit:10,
      reverse:true,
      show_payer:false
    }).then(resp=>{
      this.respData=resp.rows;
      this.userid=resp.rows[0].userid;
    });      
  }

  render() {
    let modalButton = this.renderModalButton()
    let loggedIn = ''
    let logoutBtn = null
    const orderBtn = this.renderOrderButton()
    // Once UAL wrapper is implemented, uncomment below lines
    
    const u=this.props.ual.activeUser;
    if(u!=undefined || u!=null){
       this.activeUser  = u.accountName;
       loggedIn = u.accountName ? `Logged in as ${u.accountName}` : ''
    }
    
    const { accountName } = this.state.rpc.get_account('bolttech');
    modalButton = !this.activeUser && this.renderModalButton()
    logoutBtn = this.renderLogoutBtn()
    this.loadTableData()
    if(this.respData!=null){
      this.data =this.respData;
    }else{
      this.data =[];
    }
   
    const columns = [
      {
        Header: "OrderData",
        columns: [
          {
            Header: "ID",
            accessor: "id"
          },
          {
            Header: "UserId",
            accessor: "userid"
          },
          {
            Header: "Status",
            accessor: "status"
          },
          {
            Header: "Items",
            accessor: "items"
          },
        ]
      },
    ];
    
    return (
      <div  style={{ textAlign: 'center'}}>
        <img src="https://bolttech-image.s3-ap-southeast-1.amazonaws.com/images/ph/phase2_welcome_banner.jpg" height="200"/>
        <h2 style={{color:'#2EB5C7'}}>Bolttech Wallet App</h2>
        <div style={{marginBottom: '20px'}}></div>
        {modalButton}
        <h3 style={{color:'#ffc107'}}>{loggedIn}</h3>
        {this.renderOrderForm()}
        {orderBtn}
        {logoutBtn}
        <div style={{backgroundColor:'white',paddingBottom:'10px'}}>
        <Table columns={columns} data={this.data} />
        </div>
      </div>
    )
  }
}

export default OrderEntryApp;