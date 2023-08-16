import React, { useState} from 'react';
import { useQuery, useMutation } from '@apollo/client';
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
  IonText,
} from '@ionic/react';
import { Link} from 'react-router-dom';
import { GET_ALL_PRODUCTS, DELETE_PRODUCT } from '../graphql';
import { addOutline } from 'ionicons/icons';




const Products: React.FC = () => {


  const { loading, error, data } = useQuery(GET_ALL_PRODUCTS);


  

  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleDeleteClick = (productId: string) => {
    setSelectedProductId(productId);
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct({
        variables: {
          id: selectedProductId,
        },
      });

      console.log('Product deleted:', selectedProductId);
      setSelectedProductId(null);
      setShowDeleteAlert(false);
      window.location.reload();

    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const productAdded = sessionStorage.getItem('productAdded');
  const productUpdated = sessionStorage.getItem('productUpdated');



  if (loading) return <IonLoading isOpen={true} message="Loading..." />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Products</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
      {productAdded === 'true' && (
          <IonText className="success-message">
            Product successfully added!
          </IonText>
        )}
        {productUpdated === 'true' && (
          <IonText className="success-message">
            Product successfully updated!
          </IonText>
        )}
        
  <IonGrid>
    <IonRow>
      {data.getAllProducts.map((product: { id: string; name: string; price: number; quantity: number }) => (
        <IonCol key={product.id} size="6">
          <IonCard className="ion-text-center">
            <IonCardHeader>
              <IonCardTitle>{product.name}</IonCardTitle>
              <IonCardSubtitle>Price: {product.price}</IonCardSubtitle>
              <IonCardSubtitle>Quantity: {product.quantity}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonButton  color="medium" fill="outline" routerLink={`/update/${product.id}`}> Update </IonButton>
              <IonButton color="danger" fill="outline" onClick={() => handleDeleteClick(product.id)}> Delete </IonButton>
            </IonCardContent>
          </IonCard>
        </IonCol>
      ))}
    </IonRow>
  </IonGrid>

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
        <Link to='/add' style={{ color: 'inherit', textDecoration: 'none' }}>
          <IonIcon icon={addOutline} />
        </Link>
      </IonFabButton>
    </IonFab>
    </IonPage>
  );
};

export default Products;
