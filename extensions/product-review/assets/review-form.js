// 文件路径: extensions/product-reviews/assets/review-form.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('review-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 禁用按钮防止重复提交
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    try {
      // 1. 获取商品ID
      const productId = new URLSearchParams(window.location.search).get('id') 
        || document.querySelector('[data-product-id]').dataset.productId;

      // 2. 准备表单数据
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('comment', form.comment.value);
      
      // 3. 上传图片并获取URL
      const imageFiles = form.querySelector('#review-images').files;
      const imageUrls = await uploadImages(imageFiles);
      formData.append('mediaUrls', JSON.stringify(imageUrls));

      // 4. 提交到后端API
      // const response = await fetch('/apps/api/reviews', {
      //   method: 'POST',
      //   body: formData
      // });

      // if (response.ok) {
      //   alert('评论提交成功，审核通过后显示！');
      //   form.reset();
      // } else {
      //   throw new Error(await response.text());
      // }
    } catch (error) {
      console.error('提交失败:', error);
      alert(`提交失败: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '提交评论';
    }
  });

  async function uploadImages(files) {
    const uploadPromises = Array.from(files).map(async (file) => {
      const imageForm = new FormData();
      imageForm.append('file', file);
      
      const res = await fetch('/apps/reviews-api/upload', {
        method: 'POST',
        body: imageForm
      });
      
      if (!res.ok) throw new Error('图片上传失败');
      return res.json().then(data => data.url);
    });

    return Promise.all(uploadPromises);
  }
});