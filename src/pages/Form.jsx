import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import './Form.css';

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  dob: yup.date().required(),
  hobbies: yup.array().min(1, 'Select at least one hobby'),
  image: yup
    .mixed()
    .required()
    .test('fileType', 'Unsupported File Format', (value) => {
      return value && ['image/jpeg', 'image/png', 'image/svg+xml'].includes(value[0]?.type);
    }),
});

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'hobbies') {
        value.forEach((hobby) => formData.append('hobbies[]', hobby));
      } else if (key === 'image') {
        formData.append('image', value[0]);
      } else {
        formData.append(key, value);
      }
    });
    console.log(formData , data)
    // try {
    //   const res = await axios.post('http://localhost:5000/api/submit', formData);
    //   alert(res.data.message);
    // } catch (err) {
    //   alert(err.response?.data?.message || 'Submission failed');
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <label>First Name</label>
      <input {...register('firstName')} placeholder="First Name" />
      <p>{errors.firstName?.message}</p>
      <label>Last Name</label>
      <input {...register('lastName')} placeholder="Last Name" />
      <p>{errors.lastName?.message}</p>
      <label>Email</label>
      <input {...register('email')} placeholder="Email" />
      <p>{errors.email?.message}</p>
        <label>Phone Number</label>
      <input {...register('phone')} placeholder="Phone Number" />
      <p>{errors.phone?.message}</p>
        <label>Date of Birth</label>
      <input type="date" {...register('dob')} />
      <p>{errors.dob?.message}</p>
        <label>Hobbies</label>
        <div className="checkbox-group">
      <label><input type="checkbox" value="Singing" {...register("hobbies")} /> Singing</label>
      <label><input type="checkbox" value="Dancing" {...register("hobbies")} /> Dancing</label>
      <label><input type="checkbox" value="Painting" {...register("hobbies")} /> Painting</label>
      <label><input type="checkbox" value="Other" {...register("hobbies")} /> Other</label>
      </div>
      <p>{errors.hobbies?.message}</p>
        <label>Image</label>
      <input type="file" {...register('image')} />
      <p>{errors.image?.message}</p>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
