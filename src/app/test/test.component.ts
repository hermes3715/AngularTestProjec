import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  ngOnInit(): void {

  }

 selectedFiles = [];
 images = [];
 formImg = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  file: new FormControl('', [Validators.required]),
  fileSource: new FormControl('', [Validators.required])
});

constructor(private http: HttpClient){};

get f(){
  return this.formImg.controls;
}

  fileChanged(e){
    for (let index = 0; index < e.length; index++) {
      const element : File = e[index];
      this.selectedFiles.push(element);

      var reader = new FileReader();
      reader.onload = (event:any) => {

        this.images.push(event.target.result);
         this.formImg.patchValue({
            fileSource: this.images
         });

      }
      reader.readAsDataURL(element);
   }
  }

  onUploadClicked(){
    const frmData = new FormData();

    this.selectedFiles.forEach(file =>{
      const filedata : File = file;
      frmData.append('image',filedata,filedata.name);
    })
      this.http.post('firebase db link',frmData, {
        reportProgress: true,
        observe: "events"
      })
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          console.log('Upload progress: ' + Math.round(event.loaded / event.total * 100) + '%' );
        }
      });
  }
}
