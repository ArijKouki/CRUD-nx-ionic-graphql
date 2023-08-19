import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import AddProduct from './pages/addProduct';
import Products from './pages/products';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'; // Import ApolloClient and InMemoryCache
import { API, Auth } from 'aws-amplify'; // Import API and Auth from aws-amplify
import GetProduct from './pages/getProduct';
import UpdateProduct from './pages/updateProduct';
import awsmobile from '../aws-exports'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

// Configure Amplify with the imported awsconfig
API.configure(awsmobile);
Auth.configure(awsmobile);

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: awsmobile.aws_appsync_graphqlEndpoint,
  cache: new InMemoryCache(),
  headers: {
    'x-api-key': awsmobile.aws_appsync_apiKey,
  },
});

const App: React.FC = () => (
  <IonApp>
    <ApolloProvider client={client}>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Products} />
          <Route path="/get/:id" component={GetProduct} />
          <Route path="/add" component={AddProduct} />
          <Route path="/update/:id" component={UpdateProduct} />
        </IonRouterOutlet>
      </IonReactRouter>
    </ApolloProvider>
  </IonApp>
);

export default App;
