;(function( jQ, _ ){

  'use strict';

  var counter = 30;

  /*
    In JavaScript, there are several options for implementing modules, and they are:
      1) Object literal notion
      2) The Module Pattern
      3) AMD modules
      4) CommonJS modules
      5) ECMAScript Harmony modules
   */

  // ------------------------------------------------------------------------ //
  // ------------------------- Object Literals ------------------------------ //
  // ------------------------------------------------------------------------ //
  // Object literal notion
  var myModule = {

    myProperty: 'someValue',

    // Object literals can contain properties and methods.
    // We can define a further object for module configuration:
    config: {
      useCaching: true,
      language: 'en'
    },

    // define a basic method
    saySomething: function saySomethign(){
      console.log( 'Where in the world is Paul Irish today?' );
    },

    // output a value based on the current configuration
    reportMyConfig: function reportMyConfig(){
      console.log( 'Caching is: ' + (this.config.useCaching ? 'enabled' : 'disabled') );
    },

    // override the current configuration
    udpateConfig: function updateConfig( newConfig ){
      if ( typeof newConfig === 'object' ) {
        this.config = newConfig;
        console.log( this.config.language );
      }
    }
  };

  // Outputs: Where in the world is Paul Irish today?
  myModule.saySomething();
  assert(true, 'Object literal Pattern: myModule.saySomething(): ' + myModule.saySomething() );

  // Outputs: Caching is: enabled
  myModule.reportMyConfig();
  assert(true, 'Object literal Pattern: myModule.reportConfig(): ' + myModule.reportMyConfig() );
  // Outputs: Chinese
  myModule.udpateConfig({
    language: 'Chinese',
    useCaching: false
  });

  // Outputs: Caching is: disabled
  myModule.reportMyConfig();

  // ------------------------------------------------------------------------ //
  // ------------------------ The Module Pattern ---------------------------- //
  // ------------------------------------------------------------------------ //
  /*
    The Module pattern was originally defined as a way to provide both "private"
    and "public" encapsulation for classes. What this results in is a reduction
    in the likelihood of our function defined in additional scripts on the page.

    Privacy:
      - Privacy is achieved via using closures.
      - This pattern is very similar to immediately-invoked-function expression (IIFE)
   */
  var testModule = (function(){

    // counter variable enjoys its private isolated environment
    var counter = 0;

    return {
      incrementCount: function(){
        return counter+=1;
      },

      resetCounter: function(){
        console.log( 'Counter value prior to reset: ' + counter );
        counter = 0;
      },

      get: function(){
        return counter;
      }
    }
  })();

  // Increment our counter
  testModule.incrementCount();
  assert( testModule.get() === 1,
  'The Module Pattern: testModule.get() === ' + testModule.get() );

  // Reset our counter
  testModule.resetCounter();
  assert( testModule.get() === 0,
  'The Module Pattern: testModule.resetCounter() should === 0');

  var myNamespace = (function(){

    var myPrivateVar, myPrivateMethod;

    // A private counter variable
    myPrivateVar = 0;

    // A private function which logs any arguments
    myPrivateMethod = function(foo){
      console.log(foo);
    };

    return {
      // A public variable
      myPublicVar: 'foo',

      // A public function utilizing privates
      myPublicFunction: function( bar ) {

        // Increment our private counter;
        myPrivateVar += 1;

        // Call our private method using bar
        myPrivateMethod( bar );
      }
    }
  })();


  /**
   * basketModule returns an object with a public API we can use.
   *
   * Benefits of leveraging IIFE pattern:
   * - The freedom to have private functions && private members which can only be
   * consumed by our module. As they aren't exposed to the rest of the page, they're
   * considered truly private!!
   */
  var basketModule = (function(){

    // privates
    var basket = [];

    function doSomethingPrivate(){}
    function doSomethingElsePrivate(){}

    // Returns an object exposed to the public
    return {

      // Add items to our basket
      addItem: function addItem( values ) {
        basket.push( values );
      },

      // Get the count of items in the basket
      getItemCount: function getItemCount() {
        return basket.length;
      },

      // Public alias to a private function
      doSomething: doSomethingPrivate,

      // Get the total value of items in the basket
      getTotal: function getTotal(){

        var q = this.getItemCount(),
            p = 0;

        // Calculate totalCount using while loop for faster performance
        while (q--) {
          p += basket[q].price;
        }
        return p;
      }
    };
  })();

  // Adds break item
  basketModule.addItem({
    item: 'bread',
    price: 0.5
  });

  // Adds butter item
  basketModule.addItem({
    item: 'butter',
    price: 0.3
  });

  console.log(basketModule.getTotal() );

  // Test total basket value, and should be 0.5 + 0.3 = 0.8
  assert( basketModule.getTotal() === (0.5+0.3),
  'The Module Pattern: basketModule should contains 2 items: bread && butter');

  // ------------------------------------------------------------------------ //
  // -------------------- Module Pattern Variations ------------------------- //
  // ------------------------------------------------------------------------ //
  var anotherModule = (function( j, _){

    function privateMethod1() {
      var container = document.getElementById('j-container');
      if (!container) {
        container = document.createElement( 'div' );
        document.getElementsByTagName('body')[0].appendChild( container );
        container.setAttribute( 'id', 'j-container' );
      }
      j(container).html('jQuery container test');
    }

    function privateMethod2() {
      console.log(_.min([10, 5, 100, 2, 1000]) );
    }

    return {
      publicMethod: function(){
        privateMethod1();
      }
    };
  })( jQ, _);

  anotherModule.publicMethod();

  // ------------------------------------------------------------------------ //
  // --------------------- The Revealing Module Pattern --------------------- //
  // ------------------------------------------------------------------------ //
  /**
   * The Revealing Module Pattern is a slightly improved version of "The Module Pattern"
   * The result of "The Revealing Module Pattern" was an updated pattern where we would
   * simply define all our functions and variables in the private scope and return an
   * anonymous object with pointers to the private functionality we wished to reveal to public.
   */
  var myRevealingModule = (function(){

    var privateVar = 'Kobe Bryant',
        publicVar  = 'Hey there!';

    function privateFunction(){
      console.log( 'Name: ' + privateVar );
      return privateVar;
    }

    function publicSetName( name) {
        privateVar = name;
    }

    function publicGetName(){
      return privateFunction();
    }
    // Reveal public pointers to private
    // functions and properties.
    return {
      setName: publicSetName,
      greeting: publicVar,
      getName: publicGetName
    };
  })();

  myRevealingModule.setName( 'Jay Kan' );
  var myName = myRevealingModule.getName();
  assert( myName === 'Jay Kan',
  'The Revealing Module Pattern: My name should be === ' + myName );

  // ------------------------------------------------------------------------ //
  // ---------------------- The Singleton Pattern --------------------------- //
  // ------------------------------------------------------------------------ //
  /*
    Singletons differ from static classes (or objects) as we can delay their initialization, generally
    because they require some information that may not be available during initialization time. In JavaScript,
    Singletons server as a shared resource namespace which isolate implementation code from the global namespace
    so as to provide a single unit point of access for functions.

    The applicability of the Singleton Pattern:
     - There must be exactly one instance of a class, and it must be accessible to clients from a well-known access point.
     - When the sole instance should be extensible by subclassing, and clients should be able to use an extended instance
       without modifying their code.

    In practice, the Singleton pattern is useful when exactly one object is needed to coordinate others across a system.
   */
  var mySingleton = (function(){
    // Instance stores a reference to the Singleton
    var instance;
    function init(){
      // Singleton
      // Private methods and variables
      function privateMethod(){
        console.log('I am private.');
      }

      var privateVariable = 'I am also private.';
      var privateRandomNumber = Math.random();

      return {
        // Public methods and variables
        publicMethod: function(){
          console.log( 'The public can se me!');
        },

        publicProperty: 'I am also public',

        getRandomNumber: function(){
          return privateRandomNumber;
        }
      }
    }

    return {
      // Get the Singleton instance if one exists
      // or create one if it doesn't.
      getInstance: function(){
        if (!instance) {
          instance = init();
        }
        return instance;
      }
    };
  })();

  var myBadSingleton = (function(){
    // Instance stores a reference to the Singleton
    var instance;

    function init(){
      // Singleton
      var privateRandomNumber = Math.random();
      return {
        getRandomNumber: function(){
          return privateRandomNumber
        }
      };
    }

    return {
      // Always create a new Singleton instance
      getInstane: function(){
        instance = init();
        return instance;
      }
    };
  })();

  // Usage:
  var singleA = myBadSingleton.getInstane();
  var randomA = singleA.getRandomNumber();
  assert(randomA,
  'The Singleton Pattern: Singleton_A has a random number: ' + randomA);

  // A good example of using Singleton Pattern:
  var SingletonTester = (function(){

    // options: an object containing configuration options for the singleton.
    // e.g var options = { name: 'test', pointX: 5 };
    function Singleton( options ) {

      // set options to the options supplied
      // or an empty object if none are provided.
      options = options || {};

      // set some properties for our singleton
      this.name = 'SingletonTester';

      this.pointX = options.pointX || 6;

      this.pointY = options.pointY || 10;
    }

    // our instance reference holder;
    var instance;

    // an emulation of static variables and methods
    return {

      name: 'SingletonTester',

      // Method for getting an instance. It returns
      // a singleton instance of a singleton object.
      getInstance: function( options ) {
        if ( instance === undefined ) {
          instance = new Singleton( options );
        }
        return instance;
      }
    };
  })();

  var singletonTest = SingletonTester.getInstance({
    pointX: 5
  });

  assert( singletonTest.pointX === 5,
  'The Singleton Pattern: singletonTest.pointX should === ' + singletonTest.pointX);

  // ------------------------------------------------------------------------ //
  // ---------------------- The Observer Pattern ---------------------------- //
  // ------------------------------------------------------------------------ //
  /*
    The Observer is a design pattern when an object (known as a subject) maintains a list
    of objects depending on it (observers), automatically notifying them of any changes to state.

     - Subject: maintains a list of observers, facilitates adding or removing observers.
     - Observer: provides a update interface for objects that need to be notified of a Subject's changes of state.
     - ConcreteSubject: broadcasts notifications to observers on changes of state, stores the state of ConcreteObservers.
     - ConcreteObserver: stores a reference to the ConcreteSubject, implements an update interface for the Observer to ensure
       state is consistent with the Subjects.
   */

  // First, let's model the list of dependent Observers a subject may have:
  function ObserverList() {
    this.observerList = [];
  }
  ObserverList.prototype.add = function( obj ) {
    return this.observerList.push( obj );
  };
  ObserverList.prototype.count = function() {
    return this.observerList.length;
  };
  ObserverList.prototype.get = function( index ) {
    if ( index > -1 && index < this.observerList.length ) {
      return this.observerList[ index ];
    }
  };
  ObserverList.prototype.indexOf = function( obj, startIndex ){
    var i  = startIndex;
    while ( i < this.observerList.length ) {
      if ( this.observerList[i] === obj ) {
        return i;
      }
      i++;
    }
    return -1;
  };
  ObserverList.prototype.removeAt = function( index ){
    this.observerList.splice( index, 1 );
  };

  // Next, let's model the Subject and the ability to add,
  // remove, or notify observers on the observer list.
  function Subject() {
    this.observers = new ObserverList();
  }
  Subject.prototype.addObserver = function( observer ) {
    this.observers.add( observer );
  };
  Subject.prototype.removeObserver = function( observer ) {
    this.observers.removeAt( this.observers.indexOf( observer, 0) );
  };
  Subject.prototype.notify = function( context ) {
    var observerCount = this.observers.count();
    for (var i = 0; i < observerCount; i++ ) {
      this.observers.get(i).update( context );
    }
  };

  // The Observer
  function Observer() {
    this.update = function() {};
  }


  // Extend an object with an extension
  function extend( object, extension ) {
    for ( var key in extension ) {
      object[key] = extension[key]
    }
  }

  // References to our DOM Elements.
  var controlCheckBox = document.getElementById( 'mainCheckbox' ),
      addButton       = document.getElementById( 'addNewObserver'),
      container       = document.getElementById( 'observersContainer');

  // Concrete Subject

  // Extend the controlling checkbox with the new Subject Class.
  extend( controlCheckBox, new Subject() );

  // Clicking the checkbox will trigger notifications to its observers.
  controlCheckBox.onclick = function() {
    controlCheckBox.notify( controlCheckBox.checked );
  };

  addButton.onclick = addNewObserver;

  // Concrete Observer
  function addNewObserver() {

    // Create a new checkbox to be added
    var check = document.createElement( 'input' );
    check.type = 'checkbox';

    // Extend the checkbox with the Observer Class
    extend( check, new Observer() );

    // Override with custom update behaviour
    check.update = function( value ){
      this.checked = value;
    };

    // Add the new observer to our list of observers
    // for our main subject.
    controlCheckBox.addObserver( check );

    // Append the item to the container
    container.appendChild( check );
  }

  // ------------------------------------------------------------------------ //
  // ----------------- The Publish/Subscribe Implementation ----------------- //
  // ------------------------------------------------------------------------ //
  var pubSub = {};
  (function(myObject) {

    // Storage for topics that can be broadcast or
    // listened to
    var topics = {};

    // An topic identifier
    var subUid = -1;

    // Publish or broadcast events of interest
    // with a specific topic name and arguments
    // such as the data to pass along.
    myObject.publish = function( topic, args ) {

      if ( !topics[topic] ){
        return false;
      }

      var subscribers = topics[topic],
          len = subscribers ? subscribers.length : 0;

      while (len--) {
        subscribers[len].func( topic, args );
      }
      return this;
    };

    // Subscribe to events of interest with a specific
    // topic name and a callback function, to be executed
    // when the topic/event is observed.
    myObject.subscribe = function( topic, func ){

      if ( !topics[topic] ) {
        topics[topic] = [];
      }

      var token = ( ++subUid ).toString();
      topics[topic].push({
        token: token,
        func: func
      });


      return token;
    };

    // Unsubscribe from a specific topic, based on a
    // tokenized reference to the subscription.
    myObject.unsubscribe = function( token ){
      for ( var p in topics ) {
        if ( topics[p] ) {
          for ( var i = 0, j = topics[p].length; i < j; i++ ){
            if ( topics[p][i].token === token ){
              topics[p].splice( i, 1 );
              return token;
            }
          }
        }
      }
      return this;
    };
  })(pubSub);

  // Another simple message handler

  // A simple message logger that logs any topics and data received
  // our through subscriber.
  var messageLogger = function( topics, data ) {
    assert(true,
    'The pubSub logging: ' + topics + ': ' + JSON.stringify(data) );
  };

  // Subscribers listen for topics they have subscribed to and
  // invoke a callback function (e.g messageLogger) once a notification
  // is broadcast on that topic.
  var subscription  = pubSub.subscribe( 'inbox/newMessage', messageLogger );
  console.log('Token: ' + subscription);
  // Publishers are in charge of publishing topics OR notifications of
  // interest to the application. e.g:
  pubSub.publish( 'inbox/newMessage', 'Hello World from pubSub.publish()');

  // or
  pubSub.publish( 'inbox/newMessage', [ 'test', 'a', 'b', 'c' ] );

  // or
  pubSub.publish( 'inbox/newMessage', {
    sender: 'hello@google.com',
    body: 'Hey again!'
  });

  // We can also unsubscribe if we no longer wish for our subscribers
  // to be notified
  pubSub.unsubscribe( subscription );

  // Once being unsubscribed, this for example won't result in
  // our messageLogger being executed as the subscriber is no
  // longer listening.
  pubSub.publish( 'inbox/newMessage', 'Hello! Are you still there?' );



















})(window.jQuery, window._);