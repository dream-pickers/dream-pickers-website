/* Netlify Forms is the managed backend. No API key belongs in this file. */
(()=>{'use strict';
const form=document.getElementById('consultationForm');
if(!form)return;
const phone=form.elements.namedItem('phone'),button=document.getElementById('submitButton'),status=document.getElementById('formStatus');
let sending=false;
function validatePhone(){const value=phone.value.trim(),digits=value.replace(/\D/g,'');phone.setCustomValidity(/^[+0-9() .-]+$/.test(value)&&digits.length>=7&&digits.length<=15?'':'Enter a valid phone number containing 7 to 15 digits.');}
phone.addEventListener('input',validatePhone);
form.addEventListener('submit',async event=>{
 event.preventDefault();if(sending)return;
 for(const name of ['name','email','phone','location','budget','message'])form.elements.namedItem(name).value=form.elements.namedItem(name).value.trim();
 validatePhone();if(!form.reportValidity())return;
 status.textContent='';
 if(!/^https?:$/.test(location.protocol)){status.textContent='To send your enquiry, open the published website. This downloaded preview cannot send forms.';status.focus();return;}
 if(form.elements.namedItem('bot-field').value)return;
 sending=true;button.disabled=true;button.textContent='Sending your enquiry…';form.setAttribute('aria-busy','true');
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const body=new URLSearchParams(new FormData(form)).toString();
  const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body,signal:controller.signal});
  if(!response.ok)throw new Error('Submission not accepted');
  form.reset();phone.setCustomValidity('');status.textContent='Thank you. Your enquiry has been submitted. Dream Pickers can contact you using the details you provided.';status.focus();
 }catch(error){status.textContent='We could not confirm delivery. Your entries are still here. Please check your connection and try again. If you already submitted this enquiry, avoid sending it repeatedly.';status.focus();}
 finally{clearTimeout(timeout);sending=false;button.disabled=false;button.innerHTML='Send my enquiry <span aria-hidden="true">↗</span>';form.removeAttribute('aria-busy');}
});
})();
