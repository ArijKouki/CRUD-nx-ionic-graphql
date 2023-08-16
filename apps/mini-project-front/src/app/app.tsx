// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import React from 'react';
import { IonApp, IonRouterOutlet,setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route} from 'react-router-dom';
import AddProduct from './pages/addProduct';
import Products from './pages/products';
import { ApolloProvider} from '@apollo/client';
import client from './appoloClient';
import GetProduct from './pages/getProduct';
import UpdateProduct from './pages/updateProduct';


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

