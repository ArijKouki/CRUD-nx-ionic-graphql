import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonLabel, IonItem } from '@ionic/react';
import { API, graphqlOperation } from 'aws-amplify';
import { updateProduct } from '../../graphql/mutations'; // Import your mutation
import { getProduct } from '../../graphql/queries'; // Import your mutation

const UpdateProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    quantity: 0,
  });


  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await API.graphql(graphqlOperation(getProduct, { id }));
        const product = response.data.getProduct;
        setProductData(product);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, [id]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number | undefined;

    if (name === 'price') {
      if (value === '' || !isNaN(value as any)) {
        newValue = value === '' ? '' : parseFloat(value);
      } else {
        return;
      }
    } else if (name === 'quantity') {
      if (value === '' || /^[0-9]+$/.test(value)) {
        newValue = value === '' ? '' : parseInt(value, 10);
      } else {
        return;
      }
    } else {
      newValue = value;
    }

    setProductData({ ...productData, [name]: newValue });
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const input = {
        id,
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
      };
  
      await API.graphql(graphqlOperation(updateProduct, { input }));
      history.push('/');
    } catch (error) {
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
          <IonButton color="medium" onClick={handleCancel}>
            Cancel
          </IonButton>
          <IonButton type="submit">Update</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default UpdateProduct;
