import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  successMessage(msg) {
    swal.fire({
      type: 'success',
      title: msg,
      showConfirmButton: true,
      customClass: 'swal-popupmsg'
    });
  }
  getEmail(){
    if (localStorage.getItem('tempCurrentUser') != undefined && localStorage.getItem('tempCurrentUser') != null) {
      var email = JSON.parse(localStorage.getItem('tempCurrentUser')).email;
    }
    return email;
  }
  getUserName() {
    if (localStorage.getItem('tempCurrentUser') != undefined && localStorage.getItem('tempCurrentUser') != null) {
      var userName = JSON.parse(localStorage.getItem('tempCurrentUser')).fullName;
    }
    return userName;
  }
  failureMessage(msg) {
    swal.fire({
      type: 'error',
      title: msg,
      showConfirmButton: true,
      customClass: 'swal-popupmsg'
    });
  }
  sliceEXTFromName(name) {
    /*
    const split = name.split('.');
    if(split.length){
      const lenOfLastArr = split[(split.length) - 1].length;
      const endLength = (name.length) - (lenOfLastArr + 1);
      const newName = name.slice(0, endLength);
      return newName;
    }
    */
    return name;
  }
  setRole(roleId) {
    localStorage.setItem('user_role', roleId);
  }
  setIdeaOwner() {
    localStorage.setItem('idea_owner_role', 'Idea Owner');
  }
  getIdeaOwner() {
    var roleId = localStorage.getItem('idea_owner_role');
    return roleId;
  }
  getRole() {
    /*
     var email = JSON.parse(localStorage.getItem("tempCurrentUser")).email;
     var jsonData=[
       {"email":"developer1@bct.com","role":"developer"},
       {"email":"developer2@bct.com","role":"developer"},
       {"email":"reviewer1@bct.com","role":"reviewer"},
       {"email":"reviewer2@bct.com","role":"reviewer"},
       {"email":"rajiv.r@bahwancybertek.com","role":"idea-owner"},
       {"email":"sangiithaselvaraj15@gmail.com","role":"idea-owner"}
     ]
     var role='idea-owner';
     jsonData.forEach(element => {
       
      if (element.email == email)
      {
        role =element.role;
      }
     });
     */
    var role = null;

    if (this.getIdeaOwner() == 'Idea Owner') {
      role = 'idea-owner'
    }

    var user_role = localStorage.getItem('user_role');
    if (user_role == 'Idea Owner') {
      role = 'idea-owner';
    }
    if (user_role == 'Developer') {
      role = 'developer';
    }
    if (user_role == 'Reviewer') {
      role = 'reviewer';
    }
    return role;
  }

  convertDateTimeFormat(dateTimeString, isDateString?: string) {
    const t = !!dateTimeString ? new Date(dateTimeString) : null;
    let min, hrs, month, date;
    if (t != null) {
      date = t.getDate() <= 9 ? ('0' + t.getDate()) : t.getDate();
      month = (t.getMonth() + 1) <= 9 ? ('0' + (t.getMonth() + 1)) : (t.getMonth() + 1);
      hrs = t.getHours() <= 9 ? ('0' + t.getHours()) : t.getHours();
      min = t.getMinutes() <= 9 ? ('0' + t.getMinutes()) : t.getMinutes();
    }

    if (isDateString == 'true') {
      return t != null ? date + '-' + month + '-' + t.getFullYear() : '';
    }
    return t != null ? date + '-' + month + '-' + t.getFullYear() + ' ' + hrs + ':' + min : '';
  }

  getReviewerId() {
    return 30004;
  }

  getDeveloperId() {
    return 30002;
  }
  getuserRoleCode() {
    var roleId = localStorage.getItem('user_role');
    return roleId;
  }
}
