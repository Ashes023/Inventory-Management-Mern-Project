import { Button, Col, Flex, Row, Collapse } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
// CustomInput is no longer needed for the main form, but might be used by sub-components
// import CustomInput from '../components/CustomInput'; 
import toastMessage from '../lib/toastMessage';
import { useGetAllBrandsQuery } from '../redux/features/management/brandApi';
import { useGetAllCategoriesQuery } from '../redux/features/management/categoryApi';
import { useCreateNewProductMutation } from '../redux/features/management/productApi';
import { useGetAllSellerQuery } from '../redux/features/management/sellerApi';
import { ICategory } from '../types/product.types';
import CreateSeller from '../components/product/CreateSeller';
import CreateCategory from '../components/product/CreateCategory';
import CreateBrand from '../components/product/CreateBrand';
import { SpinnerIcon, Package, Tag, Storefront, Tote, TextT, Ruler } from '@phosphor-icons/react';

// Define a style tag to inject new, unique styles for a light theme
const newStyles = `
  .page-container {
    background-color: #f7f9fc;
    min-height: calc(100vh - 6rem);
    padding: 2rem;
    overflow-x: hidden;
  }

  .form-container, .actions-container {
    background: #ffffff;
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #eef2f7;
    height: 100%;
  }

  .form-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #343a40;
    text-align: center;
    margin-bottom: 2.5rem;
    letter-spacing: 0.5px;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    position: relative;
  }

  .form-label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #495057;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .modern-input, .modern-select {
    width: 100%;
    background-color: #f1f3f5;
    border: 2px solid transparent;
    color: #343a40;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .modern-input:focus, .modern-select:focus {
    outline: none;
    background-color: #ffffff;
    border-color: #4c6ef5;
    box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.2);
  }
  
  .modern-input::placeholder {
    color: #adb5bd;
  }

  /* Style for validation errors */
  .input-field-error {
    border-color: #fa5252 !important;
    background-color: #fff5f5;
  }
  .input-field-error:focus {
    box-shadow: 0 0 0 3px rgba(250, 82, 82, 0.2) !important;
  }

  .submit-btn {
    background: #4c6ef5;
    border: none;
    padding: 0.8rem 2.5rem;
    font-size: 1rem;
    font-weight: 600;
    height: auto;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(76, 110, 245, 0.2);
    color: white;
  }
  
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #364fc7;
    box-shadow: 0 6px 20px rgba(76, 110, 245, 0.3);
  }
  
  .submit-btn:disabled {
    background: #ced4da;
    cursor: not-allowed;
  }

  .ant-collapse {
    background: transparent !important;
    border: none !important;
  }
  .ant-collapse-item {
    border: 1px solid #eef2f7 !important;
    border-radius: 8px !important;
    margin-bottom: 1rem !important;
    background: #fdfdff !important;
    overflow: hidden;
  }
  .ant-collapse-header {
    color: #343a40 !important;
    font-weight: 600 !important;
    font-size: 1.1rem !important;
  }
  .ant-collapse-content {
    background: #ffffff !important;
    color: #495057 !important;
    border-top: 1px solid #eef2f7 !important;
  }
  .ant-collapse-content-box {
    padding: 1.5rem 1rem !important;
  }
  .ant-collapse > .ant-collapse-item:last-child {
    margin-bottom: 0 !important;
  }
`;

const CreateProduct = () => {
  const [createNewProduct, { isLoading: isCreatingProduct }] = useCreateNewProductMutation();
  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const { data: sellers } = useGetAllSellerQuery(undefined);
  const { data: brands } = useGetAllBrandsQuery(undefined);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const payload = { ...data };
    payload.price = Number(data.price);
    payload.stock = Number(data.stock);

    if (payload.size === '') {
      delete payload.size;
    }

    try {
      const res = await createNewProduct(payload).unwrap();
      if (res.statusCode === 201) {
        toastMessage({ icon: 'success', text: res.message });
        reset();
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  const formFields = [
    { name: 'name', label: 'Product Name', required: true, icon: <Package size={20} color="#4c6ef5" />, placeholder: 'e.g. Modern T-Shirt' },
    { name: 'price', label: 'Price', type: 'number', required: true, icon: <Tag size={20} color="#4c6ef5" />, placeholder: 'e.g. 29.99' },
    { name: 'stock', label: 'Stock Quantity', type: 'number', required: true, icon: <Tote size={20} color="#4c6ef5" />, placeholder: 'e.g. 150' },
    { name: 'description', label: 'Description', required: false, icon: <TextT size={20} color="#4c6ef5" />, placeholder: 'A short description of the product...' },
  ];
  
  const selectFields = [
    { name: 'seller', label: 'Seller', required: true, options: sellers?.data, placeholder: 'Select Seller*', icon: <Storefront size={20} color="#4c6ef5" /> },
    { name: 'category', label: 'Category', required: true, options: categories?.data, placeholder: 'Select Category*', icon: <Tag size={20} color="#4c6ef5" /> },
    { name: 'brand', label: 'Brand', required: false, options: brands?.data, placeholder: 'Select Brand', icon: <Storefront size={20} color="#4c6ef5" /> },
  ];

  return (
    <>
      <style>{newStyles}</style>
      <div className="page-container">
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={14}>
            <div className="form-container">
              <h1 className="form-title">ADD NEW PRODUCT</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* CORRECTED: Replaced CustomInput with standard input */}
                {formFields.map(field => (
                  <div className='form-group' key={field.name}>
                    <label htmlFor={field.name} className='form-label'>{field.icon} {field.label}</label>
                    <input
                      id={field.name}
                      type={field.type || 'text'}
                      {...register(field.name, { 
                          required: field.required,
                          ...(field.type === 'number' && { valueAsNumber: true })
                      })}
                      className={`modern-input ${errors[field.name] ? 'input-field-error' : ''}`}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                {selectFields.map(field => (
                  <div className='form-group' key={field.name}>
                    <label htmlFor={field.name} className='form-label'>{field.icon} {field.label}</label>
                    <select
                      id={field.name}
                      {...register(field.name, { required: field.required })}
                      className={`modern-select ${errors[field.name] ? 'input-field-error' : ''}`}
                    >
                      <option value=''>{field.placeholder}</option>
                      {field.options?.map((item: ICategory) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className='form-group'>
                  <label htmlFor='size' className='form-label'><Ruler size={20} color="#4c6ef5" /> Size (Optional)</label>
                  <select id='size' {...register('size')} className='modern-select'>
                    <option value=''>Select Product Size</option>
                    <option value='SMALL'>Small</option>
                    <option value='MEDIUM'>Medium</option>
                    <option value='LARGE'>Large</option>
                  </select>
                </div>

                <Flex justify='center' style={{ marginTop: '2.5rem' }}>
                  <Button
                    htmlType='submit'
                    disabled={isCreatingProduct}
                    className="submit-btn"
                  >
                    {isCreatingProduct && <SpinnerIcon className='spin' weight='bold' style={{ marginRight: '8px' }} />}
                    Publish Product
                  </Button>
                </Flex>
              </form>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div className="actions-container">
              <Collapse accordion ghost>
                <Collapse.Panel header="Create New Seller" key="1">
                  <CreateSeller />
                </Collapse.Panel>
                <Collapse.Panel header="Create New Category" key="2">
                  <CreateCategory />
                </Collapse.Panel>
                <Collapse.Panel header="Create New Brand" key="3">
                  <CreateBrand />
                </Collapse.Panel>
              </Collapse>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CreateProduct;