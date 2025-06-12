import React , {useState}from 'react'
import UpdatePassword from '../Commponents/UpdatePassword'

const Setting = () => {
    const [passwordModel, setpasswordModel] = useState(false)
    const [avatarModel, setavatarModel] = useState(false)
    const [coverImage, setcoverImage] = useState(false)
    const [accountModel, setaccountModel] = useState(false)
     


  return (
    <div className='text-white'>
     <div><button onClick={()=>setpasswordModel(!passwordModel)}>Change Password</button>
     {
        passwordModel && <UpdatePassword onClose={() => setpasswordModel(false)} />
     }

     </div>
     <div><button>Change Avatar</button></div>
     <div><button>Change CoverImage</button></div>
     <div><button>Change Account Details</button></div>


    </div>
  )
}

export default Setting
