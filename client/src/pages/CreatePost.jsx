import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from "../components"
import FileSaver from 'file-saver';
import { download } from '../assets';
import { downloadImage } from '../utils';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(
    {
      name: '',
      prompt: '',
      photo: ''
    }
  );

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImg = async () => {

    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        console.log(data.data)
        setForm({ ...form, photo: data.data });
        // setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        console.log(err);
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

     const res=   await response.json();
console.log(res)
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  }
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSurpriceMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt })
  }
  const downloadGeneratedImage = (photo) => {
    if(form.prompt && form.photo){
      try{
        setLoading(true);
        FileSaver.saveAs(photo, `download.jpg`);        
      }catch(e){
        alert(e);
      }finally{
        setLoading(false);
      }     
    }
    else{
      alert("Please generate an image before downloading!")
    }   
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1
          className='font-extrabold text-[#222328] text-[32px]'
        >Create</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]
        '>Create imaginative of visually stunning images through DALL-E AI and share them with Community. </p>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className='flex flex-col
        gap-5'>
          <FormField
            labelName="Your name"
            type='text'
            name='name'
            placeholder='John Doe'
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            type='text'
            name='prompt'
            placeholder='A Space Shuttle flying above Cape Town, digital art'
            value={form.prompt}
            handleChange={handleChange}
            isSurpriceMe
            handleSurpriceMe={handleSurpriceMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button type='button' onClick={generateImg}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
          <button type="button" onClick={() => downloadGeneratedImage(form.photo)} className="outline-none bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 rounded-md w-full sm:w-auto px-5 py-2.5 border-none">
            
            {loading ? 'Downloading...' : <img src={download} alt="download" className="w-6 h-6 object-contain invert" />}
          </button>
        </div>


        <div className='mt-10'><p className='mt-2 text-[#666e75] text-[14px]'>
          you have created the image you wnat , you can share it with others in the community
        </p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2 text-center'>
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>

      </form>
    </section>
  )
}

export default CreatePost
