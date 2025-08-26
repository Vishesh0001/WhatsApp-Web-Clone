'use client'
import { ArrowDownToLine, ArrowUpRight, ChevronRight,Info,Laptop, LockKeyhole,LogIn,Phone } from "lucide-react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Cookies from "js-cookie";
import secureFetch from "@/utils/securefetch";
import { useRouter } from "next/navigation";
import Link from "next/link";
const steps = [
  {
    label: 'agent1@homedecor.example.com',
    description:''
  },
  {
    label: 'ravi@example.com',
    description:''
  },
  {
    label: 'neha@example.com',
        description:''
  },
  {
    label: 'Common Password',
   description:'AbcXyz$123'

  }
];
 
const allowedEmails=[
    'agent1@homedecor.example.com',
    'ravi@example.com',
    'neha@example.com',
]
export default function Login (){
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .oneOf(allowedEmails, 'Email not allowed. use Demo Emails only')
        .required('Email Required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password Required')
    }),
 onSubmit: async (values, { setSubmitting }) => {
      try {
        const body = { email: values.email, password: values.password };
        const resposne = await secureFetch("/login", JSON.stringify(body));
        if (resposne.code != 1) {
        alert(resposne.message || 'Login failed');
        }else{
        Cookies.set("token_test", resposne.data.token, { expires: 0.083, path: '/' });
        router.push('/')
      }

      } catch (error) {
      console.log(error);
      } finally {
        setSubmitting(false);
      }
    },
  });


return (
<div className="bg-[#FCF5EB] w-full min-h-screen font-sans text-[#111B21] text-[18px] flex justify-center">
    
 
  <div className="py-[14px] px-[20px] sm:px-[40px] w-full max-w-[580px] sm:max-w-[1000px] lg:max-w-[1525.6px] min-h-[1100px] sm:h-[900px] lg:h-[820px] flex flex-col gap-4 items-center">
  
  
  <div className="h-[73px] w-full max-w-[1100px] text-[20px] text-left text-[#25D366] relative">
    <div className="absolute top-4 left-0  h-8 w-8 border-3 border-[#25D366] rounded-full flex items-center justify-center"><Phone className="h-4 w-4 fill-[#25D366] stroke-[0.1]"/></div>
    <strong className="absolute top-4 left-9 ">WhatsApp</strong>
  </div>

    <div className="bg-[#FFFFFF]
    py-[20px] px-[16px] sm:px-[32px] lg:py-[24px] lg:px-[48px]
      w-full max-w-[531.6px] sm:max-w-[500px] lg:max-w-[871.6px] 
       min-h-[89.6px] lg:h-[117.6px]
       border rounded-3xl flex flex-col sm:flex-row gap-4 sm:gap-0 items-center">
   
        <Laptop className="fill-[#25D366]/10 stroke-[0.5] h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 flex-shrink-0"/>
        
        <div className="flex-1 text-center sm:text-left sm:ml-4">
    
            <h2 className="text-base sm:text-lg lg:text-xl">Download WhatsApp for Windows</h2>
            <p className="text-[15px] sm:text-[17px] hidden lg:block">Make calls, share your screen and get a faster experience when you download the windows app.</p>
         <div className="flex justify-center sm:justify-start hover:text-[#25D366] lg:hidden">   
           <p className="text-sm sm:text-base font-medium underline decoration-[#25D366]">Get Application </p>
           <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2"/>
         </div>
        </div>
  
 <Link href='https://www.whatsapp.com/download'target="_blank" rel="noopener noreferrer">  <button className="hidden lg:flex w-[162px] h-[52px] py-[10px] px-[24px] relative overflow-hidden items-center border border-black text-black rounded-full bg-[#25D366] group">
  <span className="absolute inset-0 bg-black rounded-full origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-in-out z-0"></span>
  <div className="relative z-10 flex items-center gap-2 transition-colors duration-700 group-hover:text-white">
    Download <ArrowDownToLine className="w-5 h-5" />
  </div>
</button></Link>
        </div>
        
        {/* second div */}
    <div className="bg-[#FFFFFF] 
     py-[20px] px-[16px] sm:px-[32px] lg:py-[24px] lg:px-[48px]
      w-full max-w-[531.6px] sm:max-w-[500px] lg:max-w-[871.6px] 
       h-auto lg:h-[406px]
     border rounded-3xl">


        <div className="flex flex-col lg:flex-row lg:space-x-12 xl:space-x-50 justify-center gap-6 lg:gap-0">
            
   
        <div className="w-full lg:w-auto">
<h1 className="text-xl sm:text-2xl lg:text-3xl mt-0 mb-2 font-semibold text-center lg:text-left">Emails to log in</h1>


   <Stepper orientation="vertical" sx={{ '& .MuiStepLabel-root': { fontSize: { xs: '14px', sm: '16px' } } }}>
      {steps.map((step) => (
        <Step key={step.label} completed={false} active>
          <StepLabel>
            {step.label}
          </StepLabel>
        
            <StepContent>
              <Typography sx={{ fontSize: { xs: '12px', sm: '14px' } }}>{step.description}</Typography>
            </StepContent>
          
        </Step>
      ))}
    </Stepper>
  
</div>

<div className="w-full max-w-sm mx-auto mt-0 py-4 sm:py-5 px-4 sm:px-7 bg-[#FCF5EB] rounded-lg shadow-md relative min-h-[280px] flex flex-col">
  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Login</h2>
  
  <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col">

    <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Enter Demo Email ID"
        onChange={formik.handleChange}
        value={formik.values.email}
        onBlur={formik.handleBlur}
        className="w-full px-3 py-2 bg-white rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
      />
      {formik.touched.email && formik.errors.email ? (
        <div className="text-red-600 text-xs sm:text-sm mt-1">{formik.errors.email}</div>
      ) : null}
    </div>

    {/* Password Field */}
    <div className="mb-6">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Enter Common Password"
        onChange={formik.handleChange}
        value={formik.values.password}
        onBlur={formik.handleBlur}
        className="w-full px-3 py-2 bg-white rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
      />
      {formik.touched.password && formik.errors.password ? (
        <div className="text-red-600 text-xs sm:text-sm mt-1">{formik.errors.password}</div>
      ) : null}
    </div>

    {/* Button - pushed to bottom */}
    <div className="mt-auto flex justify-center">
      <button 
        type="submit"
        className="w-auto h-[43px] py-[10px] px-[20px] sm:px-[24px] relative overflow-hidden items-center border border-black text-black rounded-full bg-[#25D366] group transition-all duration-300 hover:shadow-lg"
      >
        <span className="absolute inset-0 bg-black rounded-full origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-in-out z-0"></span>
        <div className="relative z-10 flex items-center gap-2 transition-colors duration-700 group-hover:text-white">
          <span className="text-sm sm:text-base">Log-in</span> <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </button>
    </div>
  </form>
</div>

</div>

<div className="flex flex-col sm:flex-row sm:space-x-8 lg:space-x-40 mt-3 lg:mt-2 gap-4 sm:gap-0">

<div className="flex items-center justify-center sm:justify-start">
  <Checkbox
    defaultChecked
    sx={{
      color: '#FFFFFF',
      '&.Mui-checked': {
        color: '#25D366',
      },

      transform: { xs: 'scale(0.8)', sm: 'scale(1)' }
    }}
  />
  <span className="text-sm sm:text-base">Stay logged in on this browser</span>
  <Info className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
</div>


<div className="flex justify-center sm:justify-start">
    <div className="flex hover:text-[#25D366] items-center">   
      <p className="text-sm sm:text-base font-medium underline decoration-[#25D366]">Login with phone number</p>
      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2"/>
    </div>
</div>
</div>

     </div>
     
   
    <div className="text-center flex justify-center flex-wrap pt-[8px] h-auto min-h-[33.2px] px-4">
  <span className="text-sm sm:text-base">Don&#39;t have a WhatsApp Account?</span>
  <span className="flex items-center hover:text-[#25D366] pl-2">
    <strong className="underline decoration-[#25D366] font-normal mr-1 text-sm sm:text-base">
      Get Started
    </strong>
    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
  </span>
</div>

    <div className="text-[#8D9599] text-[14px] sm:text-[16px] flex justify-center items-center gap-1 px-4 text-center">
      <LockKeyhole className="h-4 w-4 flex-shrink-0"/> 
      <span>Your messages are end-to-end Encrypted</span>
    </div>
  
  </div>
</div>)
}

