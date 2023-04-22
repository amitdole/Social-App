import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validator, ValidatorFn, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //parent to child
  @Input() usersFromHomeController: any;
  //child to parent
  @Output() cancelRegister = new EventEmitter();

  registerForm: FormGroup = new FormGroup({});

  maxDate: Date = new Date();
  validationErrors: string[] | undefined

  constructor(private accountService: AccountService, 
    private toastr: ToastrService,
    private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['',Validators.required],
      gender: ['male'],
      Alias: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',
      [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8)]],
        confirmPassword: ['',[Validators.required,
          this.matchValues('password')]]
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) =>{
      return control.value == control.parent?.get(matchTo)?.value? null:{notMatching: true}
    }
  }

  // register(){
  //   console.log(this.registerForm?.value);
  // }

  register(){
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values =  {...this.registerForm.value, dateOfBirth: dob}
    this.accountService.register(values).subscribe({
      next: response => {
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationErrors = error
      }
    })
  }

  cancel(){
   this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined){
    if (!dob) return;

    let theDbo = new Date(dob);

    return new Date(theDbo.setMinutes(theDbo.getMinutes() - theDbo.getTimezoneOffset()))
    .toISOString().slice(0,10);
  }
}
