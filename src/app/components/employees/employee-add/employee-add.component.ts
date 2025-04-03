import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent]
})
export class EmployeeAddComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  profileImagePreview: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      salary: ['', [Validators.min(0)]],
      position: [''],
      department: [''],
      profilePicture: ['']
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.employeeForm.controls; }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.profileImagePreview = reader.result as string;
        this.employeeForm.patchValue({
          profilePicture: reader.result
        });
      };
      
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;
    this.employeeService.addEmployee({
      firstName: this.employeeForm.get('firstName')?.value,
      lastName: this.employeeForm.get('lastName')?.value,
      email: this.employeeForm.get('email')?.value,
      gender: this.employeeForm.get('gender')?.value,
      salary: this.employeeForm.get('salary')?.value ? parseFloat(this.employeeForm.get('salary')?.value) : undefined,
      position: this.employeeForm.get('position')?.value,
      department: this.employeeForm.get('department')?.value,
      profilePicture: this.employeeForm.get('profilePicture')?.value
    }).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.error = error.message || 'Failed to add employee. Please try again.';
        this.loading = false;
      }
    });
  }
}