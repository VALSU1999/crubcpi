import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { CrudService } from './service/crud.service';
//importamos el sweetalert2
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CRUDCPI';
  public usuarios: any = [];
  public estadoUsuario: boolean= false;
  constructor(
    private fb: FormBuilder,
    private crudService: CrudService
  ) {

  }

  ngOnInit(): void {
    this.listar();
    this.filtro.get('estado')?.valueChanges
      .subscribe(
        (resp) => {
                    
          this.listar(Number(resp));
        }
      )
  }

  listar(estado: any = null) {
    this.usuarios=[];
    this.estadoUsuario=false;
    this.crudService.Data()
      .subscribe(
        (resp: any) => {

          for (let i in resp) {
          
            if(estado === 1){
              if (resp[i].estado == 1) {
                resp[i].id = i;
                this.usuarios.push(resp[i]);
              } 
            }else if(estado === 0){
              if (resp[i].estado == 0) {
                resp[i].id = i;
                this.usuarios.push(resp[i]);
              }               
            }else{
              resp[i].id = i;
              this.usuarios.push(resp[i]);
            }
          }
          this.estadoUsuario= true;
        }
      );
  }

  filtro: FormGroup = this.fb.group({
    estado: [2, [Validators.required]]
  });

  miFormulario: FormGroup = this.fb.group({
    id:[''],
    usuario: ['user', [Validators.required]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    estado: [1, [Validators.required]]
  });


  limpiar() {
    this.miFormulario.reset();

  }

  guardar() {
    const { id,usuario, password, estado } = this.miFormulario.value;

    if ((usuario === null || usuario.trim().length === 0)&& password === null) {

      Swal.fire({
        icon: 'error',
        title: 'Complete el campo usuario y contraseña',
        showConfirmButton: true,
        timer: 1500
      });
      return;
    }
    if (usuario === null || usuario.trim().length === 0) {

      Swal.fire({
        icon: 'error',
        title: 'Complete el campo usuario',
        showConfirmButton: true,
        timer: 1500
      });
      return;
    }

    if (password=== null ) {
      Swal.fire({
        icon: 'error',
        title: 'Complete el campo contraseña',
        showConfirmButton: true,
        timer: 1500
      });
      return;
    }

    if (password.trim().length < 6){
      Swal.fire({
        icon: 'error',
        title: 'La contraseña debe ser al menos 6 digitos',
        showConfirmButton: true,
        timer: 1500
      });
      return;
    }



    if(id === null || id.trim().length === 0){
      if(this.existeUsuario(usuario) === 1){
        Swal.fire({
          icon: 'error',
          title: 'El usuario ya existe',
          showConfirmButton: true,
          timer: 1500
        });
        return;
        
      }
    this.crudService.addData(usuario, password, estado)
      .subscribe(
        (resp) => {
          if (resp) {
            Swal.fire({
              icon: 'success',
              title: 'Se argego correctamente',
              showConfirmButton: false,
              timer: 1500
            });
            
            this.listar();
            this.limpiar()
          }
          ;
        },
        (error) => {
          Swal.fire('Error', error, 'error');
        }
      );       
    }else{
      console.log('editar');
      this.crudService.update(id,usuario, password, estado)
      .subscribe(
        (resp) => {
          if (resp) {
            Swal.fire({
              icon: 'success',
              title: 'Se edito correctamente',
              showConfirmButton: false,
              timer: 1500
            });
            
            this.listar();
            this.limpiar()
          }
          ;
        },
        (error) => {
          Swal.fire('Error', error, 'error');
        }
      ); 
    }
  }

  existeUsuario(usuario:string){
    let existe = 0;
    for(let i in this.usuarios){
      if(this.usuarios[i].usuario === usuario){
        existe = 1;
      }
    }
    return existe;
  }


  eliminar(id: any) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Seguro que quiere eliminar?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'Se elimino el usuario',
          'success'
        )
        this.crudService.delete(id)
        .subscribe(
          (resp)=>{          
            this.listar(2);    
          }
        );
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Se cancelo',
          'Tu usuario todavia existe en la lista',
          'error'
        );
      }
    })
  }

  getUsuario(id:string){
    this.miFormulario.reset();
    this.crudService.getData(id)
    .subscribe(
        (resp:any)=>{
          this.miFormulario = this.fb.group({
            id: [id],
            usuario: [resp.usuario],
            password: [resp.password],
            estado: [resp.estado]
          });
      }
    )
  }
}
