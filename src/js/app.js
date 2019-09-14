
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
      return App.showBalance();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
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

  handleHistory: function(event){

    App.contracts.MetaStore.deployed().then(function(instance) {
      metaStoreInstance = instance
      let transferEvent = metaStoreInstance.LogProductBought({}, {fromBlock: 0, toBlock: 'latest'})
      transferEvent.get((error, logs) => {
      // print the logs
      console.log("HISTORY")
      logs.forEach(log => console.log(log.args))
      if(error){
        console.log(error)
      }
    });
    
    });
  },

  handleBuy: function(event) {
    if(!verifiyCookie()){
      openLoginModal();
      return false;
    }
    event.preventDefault();
    var price = $(event.target).attr('price')
    var id = parseInt($(event.target).attr('id'))
    const weiValue = parseFloat(price) *10e17
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.MetaStore.deployed().then(function(instance) {
        metaStoreInstance = instance
        // Execute buy as a transaction by sending account.
        return metaStoreInstance.buyProduct(id, {from: account,  value: weiValue});
          
      }).then(function(result) {
        console.log("result : "+result)

      //Saving to DB          
        var url = "http://localhost:3001/"
        axios.get(url,param)
        
        App.handleHistory();
        return App.showBalance();
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

