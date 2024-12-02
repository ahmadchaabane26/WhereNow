import React from 'react';
import Swal from 'sweetalert2';
import { getAuth, signOut } from 'firebase/auth';

const Logout = ({ className, style }) => {
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const auth = getAuth();
        signOut(auth)
          .then(() => {
            Swal.fire('Logged out', 'You have successfully logged out.', 'success');
          })
          .catch((error) => {
            Swal.fire('Error', error.message, 'error');
          });
      }
    });
  };

  return (
    <span onClick={handleLogout}>Logout</span>
  );
};

export default Logout;
