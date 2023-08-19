import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonAlert,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCol,
  IonRow,
  IonGrid,
} from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';
import { addOutline } from 'ionicons/icons';
import { listProducts } from '../../graphql/queries';
import { deleteProduct } from '../../graphql/mutations';

const Products: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null); 
  const [data, setData] = useState<Array<any> | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const history = useHistory(); // Get the history object


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsData = await API.graphql(graphqlOperation(listProducts));
      setData(productsData.data.listProducts.items);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add this effect to refetch data when history location changes
  useEffect(() => {
    const unlisten = history.listen(() => {
      fetchProducts();
    });

    return () => {
      unlisten(); // Cleanup the listener when the component unmounts
    };
  }, [history]);

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.graphql(graphqlOperation(deleteProduct, { input: { id: selectedProductId } }));
      console.log('Product deleted:', selectedProductId);
      setSelectedProductId(null);
      setShowDeleteAlert(false);
      fetchProducts(); // Refetch products after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Products</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonLoading isOpen={true} message="Loading..." />}
        {error && <p>Error: {error.message}</p>}

        {data && (
          <IonGrid>
            <IonRow>
              {data.map((product: { id: string; name: string; price: number; quantity: number }) => (
                <IonCol key={product.id} size="6">
                  <IonCard className="ion-text-center">
                    <IonCardHeader>
                      <IonCardTitle>{product.name}</IonCardTitle>
                      <IonCardSubtitle>Price: {product.price}</IonCardSubtitle>
                      <IonCardSubtitle>Quantity: {product.quantity}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton color="medium" fill="outline" routerLink={`/update/${product.id}`}>
                        Update
                      </IonButton>
                      <IonButton color="danger" fill="outline" onClick={() => handleDeleteClick(product.id)}>
                        Delete
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm Delete"
          message="Are you sure you want to delete this product?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                setSelectedProductId(null);
              },
            },
            {
              text: 'Delete',
              handler: handleDeleteConfirm,
            },
          ]}
        />
      </IonContent>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton color="success">
          <Link to="/add" style={{ color: 'inherit', textDecoration: 'none' }}>
            <IonIcon icon={addOutline} />
          </Link>
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Products;
