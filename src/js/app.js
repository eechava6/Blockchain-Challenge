
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load the products
    $.getJSON('../products.json', function(data) {
      var productsRow = $('#productsRow');
      var productTemplate = $('#productTemplate');

      for (i = 0; i < data.length; i ++) {
        productTemplate.find('.panel-title').text(data[i].name);
        productTemplate.find('img').attr('src', data[i].picture);
        productTemplate.find('.product-type').text(data[i].type);
        productTemplate.find('.product-price').text(data[i].price);
        productTemplate.find('.btn-buy').attr('price', data[i].price);
        productTemplate.find('.btn-buy').attr('id', data[i].id);
        productTemplate.find('.btn-fav').attr('id', data[i].id);
        productTemplate.find('.btn-cart').attr('id', data[i].id);
        productsRow.append(productTemplate.html());
      }
    });
   
    return await App.initWeb3();

  },

  initWeb3: async function() {
      // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
   
    $.getJSON('MetaStore.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var MetaStoreArtifact = data;
      App.contracts.MetaStore= TruffleContract(MetaStoreArtifact);
    
      // Set the provider for our contract
      App.contracts.MetaStore.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the buyed products. 
      App.verifyFavourites()
      return App.showBalance();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
    $(document).on('click', '.btn-fav', App.handleFav);
    $(document).on('click', '.btn-cart', App.addToCart);
  },

  verifyFavourites: function(){
    if(!verifiyCookie()){
      return false;
    }

    var url = "http://127.0.0.1:9000/getFavourites"
    params ={"username":getCookie("username")}
   
    const config = { headers: {'Content-Type': 'application/json'} };
    axios.get(url, {params: params}, config).then(res => { 
      if(res.status === 200){
          products  =res.data.data
          for (i = 0; i <=  products.length; i++) {
              $('.panel-pet').eq(products[i]).find('button.btn-fav').text('Already fav').attr('disabled', true);
          }
          
          }
    }).catch(error => {
        console.log('error', error);
    })
  },

  showBalance: function() {
    var metaStoreInstance;

    App.contracts.MetaStore.deployed().then(function(instance) {
      metaStoreInstance = instance;
    
      return metaStoreInstance.moneyReached.call();
    }).then(function(moneyReached) {
      console.log("The store has :" + parseInt(moneyReached)/10e17 + " ETH")
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  addToCart: function(event){
    if(!verifiyCookie()){
      openLoginModal();
      return false;
    }
    event.preventDefault();
    var id = parseInt($(event.target).attr('id'))
    user = getCookie("username");
    product = id
    productsCart = getCookie(user)    
    if(!productsCart ){
      productsCart = [product]
      var json_str = JSON.stringify(productsCart);
      setCookie(user,json_str,30)
    }else{
      if(productsCart){
        productsCart = JSON.parse(productsCart)
        productsCart.push(product)
        producsCart = Array.from(new Set(productsCart))
        var json_str = JSON.stringify(productsCart);

        setCookie(user,json_str,30)
      }
    }      
  },

  handleBuyCart: function(){
    if(!verifiyCookie()){
      openLoginModal();
      return false;
    }
    buyer = getCookie("username")
    cartToBuy = getCookie(buyer)
    if(cartToBuy){
      cartToBuy= JSON.parse(cartToBuy)
      var price = 0;
      var strProducts = "";
      for (i = 0; i <  cartToBuy.length; i++) {
        price += parseFloat($('.panel-pet').eq(cartToBuy[i]).find('button.btn-buy').attr('price'));
        strProducts += cartToBuy[i].toString()
      }

      Swal.fire(
        {text:"You are going to buy : "
        +cartToBuy.length+" produtcs, for : " +price+" ETH",
        title:"Confirm purchase",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, buy it!'}).then((result) => {
          if (result.value) {
              return App.makeTransaction(parseInt(strProducts),price*10e17,true)
          }})
    }else{
      Swal.fire("Add something to the cart!")
    }

  },

  handleHistory: function(event){
   
    App.contracts.MetaStore.deployed().then(function(instance) {
      metaStoreInstance = instance
      let transferEvent = metaStoreInstance.LogProductBought({}, {fromBlock: 0, toBlock: 'latest'})
      transferEvent.get((error, logs) => {
      // print the logs
      console.log("HISTORY")
      var history =""
      logs.forEach(log => history += "Buyer: " + log.args.buyer + " Price: " + log.args.amount.c/10000+ " ETH " + "ProductID : " +log.args.productId.c + "<br />");
      Swal.fire({
        title: "History",
        html: history
      });
      if(error){
        console.log(error)
      }
    });
    
    });
  },

  handleFav: function(event){
    if(!verifiyCookie()){
      openLoginModal();
      return false;
    }
    event.preventDefault();
    var id = parseInt($(event.target).attr('id'))
    console.log(id)
    var url = "http://127.0.0.1:9000/saveFavourite"
    params ={"username":getCookie("username"), "productId":id}
    console.log(params)
    const config = { headers: {'Content-Type': 'application/json'} };

    axios.post(url, params, config).then(res => { 
        if(res.status === 200){
            console.log("OK")
            App.verifyFavourites()
          }
    }).catch(error => {
        console.log('error', error);
    })
  },

  handleBuy: function(event) {
    if(!verifiyCookie()){
      openLoginModal();
      return false;
    }
    App.addToCart(event)
    event.preventDefault();
    var price = $(event.target).attr('price')
    var id = parseInt($(event.target).attr('id'))
    const weiValue = parseFloat(price) *10e17
    App.makeTransaction(id,weiValue,false)
  },

  makeTransaction : function(products, value, cart){
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.MetaStore.deployed().then(function(instance) {
        metaStoreInstance = instance
        // Execute buy as a transaction by sending account.
        console.log("times")
        
        return metaStoreInstance.buyProduct(products, {from: account,  value: value});
          

      }).then(function(result) {
        console.log("result : "+result)
        if(cart){
          eraseCookie(getCookie("username"))
        }
      //Saving to DB                  
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};


$(function() {
  $(window).load(function() {
    verifiyCookie();
    App.init();
  });
});

