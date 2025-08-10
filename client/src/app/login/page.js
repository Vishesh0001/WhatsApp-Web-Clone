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
        // console.log('b',body);
        
        const resposne = await secureFetch("/login", JSON.stringify(body));
        console.log('r',resposne);
        
        if (resposne.code != 1) {
// alert(`${resposne.message.keyword}`)
        }else{
          // console.log('hello',resposne.data.token);
          
          // const tokenExpiry = new Date(Date.now() + 2* 60 * 60 * 1000); //  hour
        Cookies.set("token_test", resposne.data.token, { expires: 0.083, path: '/' });
      //  Cookies.set('debug_test', '123');
        // Cookies.set('token_test', String(resposne.data.token));
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
    
  <div className="py-[14px] px-[40px] w-[580px] h-[1100px] sm:w-[1000px] sm:h-[900px] lg:w-[1525.6px] lg:h-[820px] flex flex-col gap-4 items-center">
  <div className=" h-[73px] w-[1100px] text-[20px] text-left text-[#25D366]">
    <div className="absolute top-4 left-9 h-8 w-8 border-3 border-[#25D366] rounded-full flex items-center justify-center"><Phone className="h-4 w-4 fill-[#25D366] stroke-[0.1]"/></div><strong className="absolute top-4 left-19 ">WhatsApp</strong></div>
   {/* first block */}
    <div className="bg-[#FFFFFF]
    py-[20px] px-[32px] lg:py-[24px] lg:px-[48px]
      md:w-[531.6px] sm:w-[500px] lg:w-[871.6px] 
       sm:h-[89.6px] lg:h-[117.6px]
       border rounded-3xl flex space-4 items-center">
        <Laptop className="fill-[#25D366]/10 stroke-[0.5] h-16 w-16 lg:h-20 lg:w-20"/>
        <div className="ml-4">
            <h2 className=" sm:text-lg lg:text-xl w-[520px]">Download WhatsApp for Windows</h2>
            <p className="text-[17px]  hidden  lg:block w-[520px]">Make calls, share your screen and get a faster experience when you download the windows app.</p>
         <div className="flex hover:text-[#25D366]">   <p className="block ml-2 lg:hidden text mt-2 font-medium underline decoration-[#25D366]">Get Application </p><ChevronRight className="mt-2 h-6 w-6 block ml-2 lg:hidden"/></div>
        </div>
  
<button className=" hidden lg:flex  w-[162px] h-[52px] py-[10px] px-[24px] relative overflow-hidden items-center border border-black text-black rounded-full bg-[#25D366] group">
  <span className="absolute inset-0 bg-black rounded-full origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-in-out z-0"></span>
  <div className="relative z-10 flex items-center gap-2 transition-colors duration-700 group-hover:text-white">
    Download <ArrowDownToLine className="w-5 h-5" />
  </div>
</button>
        </div>
        {/* second div */}
    <div className="bg-[#FFFFFF] 
     py-[20px] px-[32px] lg:py-[24px] lg:px-[48px]
      md:w-[531.6px] sm:w-[500px] lg:w-[871.6px] 
       h-auto lg:h-[406px]
     border rounded-3xl">

        {/* upper flex box of 2nd main part */}
        <div className="flex flex-col lg:flex-row space-x-50 justify-center">
            {/* inner first box */}
        <div>
<h1 className="text-3xl mt-0 mb-2 font-semibold">Emails to log in</h1>

   <Stepper orientation="vertical"  >
      {steps.map((step) => (
        <Step key={step.label} completed={false}  active>
          <StepLabel>
            {step.label}
          </StepLabel>
        
            <StepContent>
              <Typography>{step.description}</Typography>
            </StepContent>
          
        </Step>
      ))}
    </Stepper>
  
</div>
{/* inner second box */}
<div className="max-w-sm mx-auto mt-0 py-5 px-7 bg-[#FCF5EB] rounded-lg shadow-md relative min-h-[280px] flex flex-col">
  <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
  
  <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col">
    {/* Email Field */}
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
        <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
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
        <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
      ) : null}
    </div>

    {/* Button - pushed to bottom */}
    <div className="mt-auto flex justify-center">
      <button 
        type="submit"
        className="w-auto h-[43px] py-[10px] px-[24px] relative overflow-hidden items-center border border-black text-black rounded-full bg-[#25D366] group transition-all duration-300 hover:shadow-lg"
      >
        <span className="absolute inset-0 bg-black rounded-full origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-in-out z-0"></span>
        <div className="relative z-10 flex items-center gap-2 transition-colors duration-700 group-hover:text-white">
          Log-in <LogIn className="w-5 h-5" />
        </div>
      </button>
    </div>
  </form>
</div>



</div>
   {/* lower flex box */}
<div className="flex flex-col lg:flex-row space-x-40 mt-2">
{/* first div */}
<div className="ml-0 pl-0 flex items-center ">
  <Checkbox
    defaultChecked
    sx={{
      color: '#FFFFFF',
      '&.Mui-checked': {
        color: '#25D366',
      },
    }}
  />
  <span>Stay logged in on this browser</span>
  <Info className="ml-1 h-4 w-4" />
</div>

{/* second div */}
<div>
    <div className="flex hover:text-[#25D366]">   <p className="block ml-2 text mt-2 font-medium underline decoration-[#25D366]">Login with phone number </p><ChevronRight className="mt-2 h-6 w-6 block ml-2"/></div>
</div>
</div>

     </div>
    {/*  3rd main part */}
    <div className="text-center  flex justify-center flex-wrap pt-[8px] h-[33.2px]">
  Don’t have a WhatsApp Account?<span className="flex items-center hover:text-[#25D366] pl-2">
    <strong className="underline decoration-[#25D366] font-normal mr-1">
      Get Started
    </strong>
    <ArrowUpRight className="w-4 h-4" />
  </span>
</div>

    <div className="text-[#8D9599] text-[16px] flex justify-center"><LockKeyhole/> Your messages are end-to-end Encrypted </div>
  
  
  </div>
</div>


  )
}

