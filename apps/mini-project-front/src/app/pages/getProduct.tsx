import React, { useState, useEffect } from 'react';
import { IonLoading, IonApp } from '@ionic/react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify'; 
import { getProduct } from '../../graphql/queries';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const GetProduct: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const productId = match.params.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null); 
  const [product, setProduct] = useState<Product | null>(null);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productData = await API.graphql(graphqlOperation(getProduct, { id: productId }));
      setProduct(productData.data.getProduct);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) return <IonLoading isOpen={true} message="Loading..." />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <IonApp>
      <IonCard color="secondary">
        <IonCardHeader>
          <IonCardTitle>{product?.name}</IonCardTitle>
          <IonCardSubtitle>Price: {product?.price}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>Quantity: {product?.quantity}</IonCardContent>
      </IonCard>
    </IonApp>
  );
};

export default GetProduct;
