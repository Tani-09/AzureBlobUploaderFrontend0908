import { inject, Component } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, NgIf, HttpClientModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  apiUrl: string;

  constructor(private http: HttpClient) {
    // this.apiUrl = 'https://localhost:7091/api/fileupload/upload';
    this.apiUrl =
      'https://azureblobuploader-api-bbcycedqe5a5cacq.canadacentral-01.azurewebsites.net/api/fileupload/upload';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{ fileUrl: string }>(this.apiUrl, formData).subscribe({
      next: (response) => {
        if (!this.selectedFile) return;

        const fileName = encodeURIComponent(this.selectedFile.name);
        this.http
          .get<{ fileUrl: string }>(
            `https://azureblobuploader-api-bbcycedqe5a5cacq.canadacentral-01.azurewebsites.net/api/FileUpload/get-file-url?fileName=${fileName}`
          )
          .subscribe({
            next: (secureResponse) => {
              this.fileUrl = secureResponse.fileUrl;
            },
            error: (err) => {
              console.error('failed to fetch file url', err);
              alert('failed to get the secure file url');
            },
          });

        alert('File uploaded successfully!');
      },

      error: (err) => {
        console.error('Upload failed:', err);
        alert('Upload failed. Please try again.');
      },
    });
  }
}
