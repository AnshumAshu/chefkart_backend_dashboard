import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function ImageGallery() {
   const [images, setImages] = useState([]);
   const [selectedImage, setSelectedImage] = useState(null);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 6;

   useEffect(() => {
      fetchImages();
   }, []);

   const fetchImages = async () => {
      try {
         const res = await axios.get("http://localhost:8000/foodGall/getAll");
         setImages(res.data || []);
      } catch (err) {
         console.error("Failed to fetch images", err);
         setImages([]);
      }
   };

   const handleImageChange = (e) => {
      setSelectedImage(e.target.files[0]);
   };

   const handleUpload = async () => {
      if (!selectedImage) return alert("Please select an image to upload");

      try {
         const formData = new FormData();
         formData.append("file", selectedImage);
         formData.append("upload_preset", "marketdata");

         const cloudinaryRes = await axios.post(
            "https://api.cloudinary.com/v1_1/dabrh3qxm/image/upload",
            formData
         );

         const imageUrl = cloudinaryRes.data.secure_url;

         await axios.post("http://localhost:8000/foodGall/create", {
            image: imageUrl,
         });

         setSelectedImage(null);
         fetchImages();
      } catch (err) {
         console.error("Image upload failed", err);
      }
   };

   const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this image?")) return;
      try {
         await axios.delete(`http://localhost:8000/foodGall/delete/${id}`);
         fetchImages(); // Refresh the list
      } catch (err) {
         console.error("Failed to delete image", err);
      }
   };

   // Pagination Logic
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = images.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(images.length / itemsPerPage);

   const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
   };

   return (
      <div className="p-6 min-h-screen bg-gray-100">
         <TitleCard title="Image Gallery">
            {/* Upload Section */}
            <div className="mb-6 flex items-center gap-4">
               <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2"
               />
               <button
                  onClick={handleUpload}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
               >
                  Upload
               </button>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
               {currentItems.map((img) => (
                  <div key={img._id} className="bg-white p-2 rounded shadow relative">
                     <img
                        src={img.image}
                        alt="Gallery"
                        className="w-full h-48 object-cover rounded"
                     />
                     <p className="text-xs text-gray-500 mt-1 text-center">
                        Updated at: {new Date(img.updatedAt).toLocaleString()}
                     </p>
                     <button
                        onClick={() => handleDelete(img._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                     >
                        Delete
                     </button>
                  </div>
               ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center items-center gap-2">
               <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
               >
                  Prev
               </button>
               {Array.from({ length: totalPages }, (_, i) => (
                  <button
                     key={i}
                     onClick={() => handlePageChange(i + 1)}
                     className={`px-3 py-1 border rounded ${
                        currentPage === i + 1
                           ? "bg-blue-500 text-white"
                           : "bg-gray-100"
                     }`}
                  >
                     {i + 1}
                  </button>
               ))}
               <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
               >
                  Next
               </button>
            </div>
         </TitleCard>
      </div>
   );
}

export default ImageGallery;
