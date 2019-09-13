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
        productTemplate.find('.btn-buy').attr('data', data[i].id);

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
      console.log("The store has :" + moneyReached)
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBuy: function(event) {
    event.preventDefault();
    console.log(event)
    var price = parseInt($(event.target).data('data-id'));
    console.log(price)
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      console.log(App.contracts)
      App.contracts.MetaStore.deployed().then(function(instance) {
        
        metaStoreInstance = instance
        // Execute adopt as a transaction by sending account
        return metaStoreInstance.buyProduct(price, {from: account});
      }).then(function(result) {
        console.log(result)
        return App.showBalance();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
