import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonItem } from '@ionic/react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PRODUCT, GET_PRODUCT } from '../graphql';

const UpdateProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    quantity: 0,
  });

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  //console.log(data);



  useEffect(() => {
    if (data && data.getProduct) {
      const { name, price, quantity } = data.getProduct;
      setProductData({ name, price, quantity });
    }
  }, [data]);

  /*useEffect(() => {
    if (data && data.getProduct) {
      const { name, price, quantity } = data.getProduct;
      setProductData({ name, price, quantity });
    } else {
      // Reset productData when no data is available (after canceling)
      setProductData({
        name: '',
        price: 0,
        quantity: 0,
      });
    }
  }, [data]);*/

  const [updateProduct] = useMutation(UPDATE_PRODUCT);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number | undefined;
  
    if (name === 'price') {
      // Validate and update the price value only if it's a valid number
      if (value === '' || !isNaN(value as any)) {
        newValue = value === '' ? '' : parseFloat(value);
      } else {
        return; // Exit early if the value is not a valid number
      }

    } else if (name === 'quantity') {
      // Validate and update the quantity value only if it's a valid integer
      if (value === '' || /^[0-9]+$/.test(value)) {
        newValue = value === '' ? '' : parseInt(value, 10);
      } else {
        return; // Exit early if the value is not a valid integer
      }

    } else {
      newValue = value;
    }
  
    setProductData({ ...productData, [name]: newValue });
  };
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await updateProduct({
        variables: {
          id,
          name: productData.name,
          price: productData.price,
          quantity: productData.quantity,
        },
      });
      sessionStorage.setItem('productUpdated', 'true');
      history.push('/'); 
    } catch (error) {
      console.log(error);
    }
  };


  const handleCancel = () => {
    history.push('/');
  };


  if (loading) return <IonContent>Loading...</IonContent>;
  if (error) return <IonContent>Error: {error.message}</IonContent>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Update Product</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
          
          <IonButton color="medium" onClick={handleCancel}>Cancel</IonButton>
          <IonButton type="submit">Update</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default UpdateProduct;
