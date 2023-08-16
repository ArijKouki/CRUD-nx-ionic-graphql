import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonLabel, IonItem } from '@ionic/react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_PRODUCT, GET_ALL_PRODUCTS } from '../graphql'; 
import { useHistory } from 'react-router-dom';
import { ApolloError } from '@apollo/client';

const AddProduct: React.FC = () => {
  const history = useHistory();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    quantity: '',
  });

  const [error, setError] = useState<string | null>(null);


  //const [createProduct] = useMutation(CREATE_PRODUCT);

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      // After creating a new product, trigger a refetch of the product list
      getAllProductsQueryRefetch();
      history.push('/');
    },
  });

  const { refetch: getAllProductsQueryRefetch } = useQuery(GET_ALL_PRODUCTS);





  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'name') {
      setProductData({ ...productData, [name]: value });
    } else if (name === 'price' || name === 'quantity') {
      if (value === '' || !isNaN(value as any)) {
        setProductData({ ...productData, [name]: value });
      }
    }
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        variables: {
          name: productData.name,
          price: parseFloat(productData.price),
          quantity: parseInt(productData.quantity),
        }
      })

      sessionStorage.setItem('productAdded', 'true');

      history.push('/');
    } catch (error) {
      if (error instanceof ApolloError) {
      setError(error.message);
    } else {
      setError("An error occurred."); 
    }
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push('/'); 
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Product</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      {error && <div>{error}</div>}
        <form onSubmit={handleSubmit}>
        <IonItem>
            <IonLabel position="fixed">Name</IonLabel>
            <input
              type="text"
              name="name"
              value={productData.name}
              placeholder="Product Name"
              onChange={handleChange}
            />
        </IonItem>
        <IonItem>
            <IonLabel position="fixed">Price</IonLabel>
            <input
              type="text"
              name="price"
              value={productData.price}
              placeholder="Price"
              onChange={handleChange}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="fixed">Quantity</IonLabel>
            <input
              type="text"
              name="quantity"
              value={productData.quantity}
              placeholder="Quantity"
              onChange={handleChange}
            />
          </IonItem>
          <div className="d-flex justify-content-center">
            <IonButton color="medium" onClick={handleCancel}>
              Cancel
            </IonButton>
            <IonButton type="submit">Add</IonButton>
          </div>
        </form>
        
      </IonContent>
    </IonPage>
  );
};

export default AddProduct;
