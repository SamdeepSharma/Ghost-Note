"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const AlertWrapper = () => {
  return (
      <Alert
        onClick={()=>{scrollTo(0,document.body.scrollHeight)}} 
        variant="info" 
        timeout={10000} 
        onClose={() => console.log('Alert closed')}
        className="m-2 hover:cursor-pointer shadow-lg md:mx-auto"
      >
        <div className="text-center">
          <AlertTitle className='text-center'>Developed by Sam</AlertTitle>
          <AlertDescription>
            Please sign up to become a ghost user and start your mystery adventure!
          </AlertDescription>
        </div>
      </Alert>
  )
}

export default AlertWrapper