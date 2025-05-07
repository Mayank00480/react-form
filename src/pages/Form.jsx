import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import './Form.css';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  dob: yup.date().required('Date of birth is required'),
  hobbies: yup.array().min(1, 'Select at least one hobby'),
  image: yup
    .mixed()
    .required('Please upload an image')
    .test('fileType', 'Unsupported file format. Use JPEG, PNG or SVG only', (value) => {
      return value && ['image/jpeg', 'image/png', 'image/svg+xml'].includes(value[0]?.type);
    }),
});

function Form() {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [fileName, setFileName] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Track checkbox changes
  const handleHobbyChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedHobbies([...selectedHobbies, value]);
    } else {
      setSelectedHobbies(selectedHobbies.filter(hobby => hobby !== value));
    }
  };

  // Track file name for better UI
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

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
    console.log(formData, data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Form submitted successfully!');
    // API submission code here
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Registration Form</h2>
        <p>Please complete all fields to create your account</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input 
            id="firstName" 
            {...register('firstName')} 
            placeholder="Enter your first name" 
            autoComplete="given-name"
          />
          {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input 
            id="lastName" 
            {...register('lastName')} 
            placeholder="Enter your last name"
            autoComplete="family-name" 
          />
          {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            id="email" 
            type="email"
            {...register('email')} 
            placeholder="example@email.com"
            autoComplete="email"
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            id="phone" 
            {...register('phone')} 
            placeholder="(XXX) XXX-XXXX"
            autoComplete="tel" 
          />
          {errors.phone && <p className="error-message">{errors.phone.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input 
            id="dob" 
            type="date" 
            {...register('dob')}
            autoComplete="bday" 
          />
          {errors.dob && <p className="error-message">{errors.dob.message}</p>}
        </div>
        
        <div className="form-group">
          <label>Hobbies & Interests</label>
          <div className="checkbox-group">
            {['Singing', 'Dancing', 'Painting', 'Reading', 'Cooking', 'Sports', 'Photography', 'Gaming'].map(hobby => (
              <label 
                key={hobby} 
                className={selectedHobbies.includes(hobby) ? 'checked' : ''}
              >
                <input 
                  type="checkbox" 
                  value={hobby} 
                  {...register("hobbies")} 
                  onChange={handleHobbyChange}
                />
                <span>{hobby}</span>
              </label>
            ))}
          </div>
          {errors.hobbies && <p className="error-message">{errors.hobbies.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Profile Photo</label>
          <div className="file-upload-container">
            <div className="file-upload-label">
              {fileName ? `Selected: ${fileName}` : "Drop your file here or click to browse"}
            </div>
            <input 
              id="image" 
              type="file" 
              {...register('image')} 
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/svg+xml"
            />
          </div>
          {!fileName && <p className="file-info">Accepted formats: JPEG, PNG, SVG</p>}
          {errors.image && <p className="error-message">{errors.image.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
}

export default Form;