import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent]
})
export class EmployeeEditComponent implements OnInit {
  employeeForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  employeeId: string | null = null;
  profileImagePreview: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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

    this.employeeId = this.route.snapshot.paramMap.get('id');
    
    if (this.employeeId) {
      this.loading = true;
      this.employeeService.getEmployee(this.employeeId)
        .subscribe({
          next: (employee) => {
            this.employeeForm.patchValue({
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
              gender: employee.gender,
              salary: employee.salary,
              position: employee.position,
              department: employee.department,
              profilePicture: employee.profilePicture
            });
            
            this.profileImagePreview = employee.profilePicture || null;
            this.loading = false;
          },
          error: () => {
            this.error = 'Error loading employee data. Please try again.';
            this.loading = false;
          }
        });
    }
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

    if (!this.employeeId) {
      this.error = 'Employee ID not found.';
      return;
    }

    this.loading = true;
    this.employeeService.updateEmployee({
      id: this.employeeId,
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
        this.router.navigate(['/employees', this.employeeId]);
      },
      error: (error) => {
        this.error = error.message || 'Failed to update employee. Please try again.';
        this.loading = false;
      }
    });
  }
}