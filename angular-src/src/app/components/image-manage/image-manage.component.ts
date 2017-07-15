import { Component, OnInit } from '@angular/core';
import {ImagesService} from '../../services/images.service'
import {Router} from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';

import { Subscription } from "rxjs/Subscription";
import 'rxjs/add/operator/map';

declare const Materialize: any;

@Component({
  selector: 'app-image-manage',
  templateUrl: './image-manage.component.html',
  styleUrls: ['./image-manage.component.css']
})
export class ImageManageComponent implements OnInit {

  images: Array<Object>
  imagesSub: Subscription;
  newImagesSub: Subscription;

  constructor(private imagesService: ImagesService,
      private router: Router
) { }

  ngOnInit() {
    // console.log('test')
    this.loadGallery()

    this.newImagesSub = this.imagesService.listenImages().subscribe(res => {
      // console.log(res)
      if(this.images == null) {
        this.images = [{url: res}]

      } else {
        this.images.push({url: res})
      }
    })

  }

  loadGallery(){
    this.imagesSub = this.imagesService.getImages().subscribe(res => {
      // console.log(res)
      this.images = res.gallery
    })
  }

  deleteImage(imageUrl:String){
    //Strip URL for filename
    // console.log(imageUrl)
    var urlSplit : Array<string>
    urlSplit = imageUrl.split("/")
    // console.log(urlSplit)
    const fileName = urlSplit[urlSplit.length-1]
    //Send request with url and filename
    const image = {
      fileName: fileName,
      url: imageUrl
    }
    this.imagesService.deleteImages(image).subscribe(res => {
      // console.log(res)
    //if image successfully deleted notify user
      if(res.success){
        Materialize.toast( res.msg ||  "Image deleted successfully.", 2000, 'rounded toast-success')      
        var index = this.images.findIndex(x => (x as any).url == image.url)
        this.images.splice(index, 1)
      } else {
        Materialize.toast( res.msg ||  "Unknown error try again.", 2000, 'rounded toast-danger')      
        window.location.reload()
      }    
    })
  }

  ngOnDestroy(){
    if(this.imagesSub != null) {
      this.imagesSub.unsubscribe()
    }
    if(this.newImagesSub != null) {
      this.newImagesSub.unsubscribe()
    }
  }

}
