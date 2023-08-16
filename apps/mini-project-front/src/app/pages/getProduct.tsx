
import React from 'react';
import { useQuery } from '@apollo/client';
import { IonLoading, IonApp } from '@ionic/react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { GET_PRODUCT} from '../graphql'; 
import { RouteComponentProps } from 'react-router-dom';

const GetProduct: React.FC<RouteComponentProps<{ id: string }>>= ({match} ) => {
    const productId= match.params.id;
    const { loading, error, data } = useQuery(GET_PRODUCT, {
      variables: { id: productId }, 
    });

  if (loading) return <IonLoading isOpen={true} message="Loading..." />;
  if (error) return <p>Error: {error.message}</p>;
  const product= data.getProduct;

  return (
    <IonApp>
    
       <IonCard color="secondary">
            <IonCardHeader>
                <IonCardTitle>{product.name}</IonCardTitle>
                <IonCardSubtitle>Price: {product.price}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>Quantity: {product.quantity}</IonCardContent>
      </IonCard>

    </IonApp>
  );
};

export default GetProduct;
