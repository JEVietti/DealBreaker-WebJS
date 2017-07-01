import { Component, OnInit } from '@angular/core';
import {ImagesService} from '../../services/images.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  private imageURL : String;
  private signedURL: any;
  private file: any;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private imageService: ImagesService
  ) { }

  ngOnInit() {
  }
  
  onFileChosen(file){
    console.log(file)
    
    this.imageService.getSignedURL(file[0]).subscribe( res => {
      console.log(res)
      if(res.url != null && res.signedRequest != null ) {
        this.file = file[0]
        this.signedURL = res.signedRequest
        this.imageURL = res.url
        var reader = new FileReader();
         
          reader.onload = (function(file) {
                return function(e) {
                  var preview = document.createElement("img");
                  preview.src=e.target.result
                  preview.title=file.name
                  document.getElementById('list').appendChild(preview)
                };
          })(this.file);
           
          reader.readAsDataURL(this.file);

      //console.log(file[0])      
      //this.fileUpload(file[0], res.url, res)
      } else {
        console.log('No signed url')
      }
      
    })
  }

uploadFile(){
    this.imageService.uploadFile(this.file, this.signedURL, this.imageURL).subscribe( res => {
        console.log(res)      
      if(res.status === 200){
         console.log('User Image uploaded!')            
        this.imageService.saveImage(this.imageURL).subscribe(res => {
         if(res.success){
          //Notify User Image Uploaded and Saved
           console.log('User Image Saved!')
           console.log(res)
        } else {
  
         }
       })
    } else {
      console.log('User Image Failed to Upload')
    }
    
      
    })
  }
}

export default ImagesComponent