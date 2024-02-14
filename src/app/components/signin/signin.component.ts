import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, Input, OnInit, SimpleChanges, ɵɵpureFunction1 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Rta } from 'src/app/model/rta';
import { Router } from '@angular/router';
import { CombuscolfeService } from 'src/app/services/combuscolfe.service';
import { DepartamentoI, CiudadI, tipopersonaI } from '../../model/model.interface';
import { DatosService} from '../../services/datos.service';
import { ToastService } from '../../services/toast.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { SwitchService } from '../../services/switch.service';

import { LoginService } from '../../services/login.service';
import { HashService } from '../../services/hash.service';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from 'src/app/interfaces/login-response';

import Swal from 'sweetalert2'; 


export interface DialogData {
  si: string;
  no: string;
}


//*declare var $: any;*/
const country = 'CO';
const tax_level_code = 'R-99-PN';
const tax_id = 'ZZ';
const customer_dian= 'INVALIDO';


declare var funcion1:any; // Para utilizar las funciones javascript

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  providers:[DatosService]
})
export class SigninComponent implements OnInit {

  formulario!: FormGroup;
  confirmarSwitch!: boolean;
  usuario!:String;
  session!:string;
  registroExitoso:Boolean=true;

  
  // Información para HASH - USUARIO - CLAVE
  hash: any=[];
  user!:string;
  password!:string;
  loginError: boolean = false;
  hashedText!:string;
  response!:LoginResponse;

  valido: boolean = false;
  
  mostrar: Boolean=false;
  mensaje:String="Se muestra la información";
  mensaje_enlace: String = 'Mostrar';
  selected: String ='';

  tipopersonaA= [
    { id: '1', name: 'Persona Juridica' },
    { id: '2', name: 'Persona Natural'},

];  
  public archivos: any = [];


  public pselectedDpto: DepartamentoI = { id:'11', name: 'Bogotá' };


  public pdpto!: DepartamentoI[];
  public pselectedCity: CiudadI = { id:'11001', departamentoId:'11', name: 'BOGOTÁ, D.C.'  };
  public ptipopersonaA: tipopersonaI = { id:'1', name: 'Persona Juridica'  }; 


  public ciudadesSeleccionadas!: CiudadI[];
  public tipopersonaSeleccionada!: tipopersonaI[];
  public _rut: string = '';
  public _rutb64: string = '';
  public show!: any;
  

  @Input() fecha! : string;
  @Input() documento! : string;
  @Input() confirmardocumento! : string;
  
  @Input() tipodocumento! : string;
  @Input() tipopersona! : string;

  @Input() tipopersona7! : string;
  @Input() persona! : string;



  @Input() regimen! : string;
  @Input() razonsocial! : string;
  

  @Input() primernombre!: string;
  @Input() segundonombre!: string;
  @Input() primerapellido!: string;
  @Input() segundoapellido!: string;

  @Input() email! : string;
  @Input() celular! : string;
  @Input() bases! : string;
  @Input() email_alternativo_1! : string;
  
  

  @Input() ok! : boolean; 
  @Input() ok2! : boolean;
  
  @Input() department! : string; 
  @Input() city!: string; 
  error! : string;  
  fecha1 = new Date();
  
   
  constructor(private fb: FormBuilder,  private datasvc: DatosService, private toastService:ToastService, private combuscolfeService: CombuscolfeService,  private router: Router, 
    private http: HttpClient, private confirmarSS: SwitchService,private hashService: HashService, private loginService: LoginService ) 
  {
    /*this.iniciaFormulario();*/
  }

  ngOnInit(): void 
  {
    //this.confirmarSS.$confirmar.subscribe((valor)=> {this.confirmarSwitch = valor})
    this.pdpto= this.datasvc.getDepartamentos();
    this.ciudadesSeleccionadas = this.datasvc.getCiudades();    
    this.tipopersonaSeleccionada = this.datasvc.gettipoPersona();
  } 
  
  openConfirmar(){
    this.confirmarSwitch = true;
    console.log("Hola");
    console.log('Valor del switch:',this.confirmarSwitch);


 }

 showModal() 
  {
   
    //Swal.fire('Error', 'El código ya se encuentra bloqueado')

    Swal.fire({
        icon: 'warning',
        title: 'Crear cliente facturación electrónica',
        text: ' Esta seguro de crear el cliente ?',
        showCancelButton: true,
        confirmButtonColor: '#005da1', 
        cancelButtonColor: '#e63020',
        confirmButtonText: 'Si'

    }).then((result) => 
    
    {

      if (result.isConfirmed)
      {
        this.irVerificar();
       
                
        if (this.registroExitoso == true){
          
          Swal.fire(
            'Registro adicionado!',
            'Cliente factura electrónica creado..',
            'success'
          );

        }
    
          //this.registroExitoso=true;
      }
    })
  
  }

  continuar()
  {
    if( this.ok )
    {
    
      let exito =  this.validarDocumento();

      if(exito) 
        exito = this.confirmarDocumento();

      if(exito) 
        exito = this.compararDocumentos(); 
    
      if(exito) 
        exito = this.validarTipodocumento();

      if( exito )
        exito = this.validarTipopersona();

      if( exito )
        exito = this.validarRegimen();

      if( exito )
         if(this.ptipopersonaA.id == '1'){
          exito = this.validarRazonsocial();
         }

      if( exito )
         if(this.ptipopersonaA.id == '2'){
          exito = this.validarPrimernombre();
         }
       
         //else{
          //exito = this.validarPrimernombre();
         //      }

      if( exito )
        
        exito = this.validarEmail();

      if( exito )
        exito = this.validarCelular();

      if(exito)
          //this.showModal();
          //if(this.registroExitoso==true)
          //{
            this.irVerificar();      
          //}
                
    }
    else
    {
      this.toastService.onShowMessage.emit( "Debes aceptar los términos y condiciones para continuar" );
      this.error = ("Debes aceptar los términos y condiciones para continuar");
    }  
    
  }

  onSelect(id: string): void 
  { 
    this.ciudadesSeleccionadas = this.datasvc.getCiudades().
    filter(dpt => dpt.departamentoId == id);
  }

  


  validarDocumento()
  {
    let exito = false;
    let regex= new RegExp( /^\d{6,14}$/g );

    this.error = '';
    
    if( regex.test(this.documento) != true ) 
    {
      this.error = ("El numero de documento esta mal escrito, por favor verificar");
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }

  confirmarDocumento()
  {
    let exito = false;
    let regex= new RegExp( /^\d{6,14}$/g );

    this.error = '';
    
    if( regex.test(this.confirmardocumento) != true ) 
    {
      this.error = ("La confirmación del numero de documento esta mal escrito, por favor verificar");
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }

  compararDocumentos()
  {
    let exito = false;
    this.error = '';

    if(this.documento == this.confirmardocumento)
    {
      exito= true;
    }
    else
    {
      this.error = ( "El NIT y/o Cédula para la facturación electrónica no esta confirmado de manera correcta" );
    }

    return exito;
  }




  validarTipodocumento()
  {
    let exito = false;
    let ltdocumento= null;
    
    if( this.tipodocumento == ltdocumento) 
    {  
      this.error = ("El tipo de documento debe ser seleccionado, por favor verificar.");
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }
  

  validarTipopersona()
  {
    let exito = false;
    let ltdocumento= null;
    
    //ptipopersonaA.name
    if(( this.ptipopersonaA.id == ltdocumento) && ( this.ptipopersonaA.id != ""))
    {
      this.error = ("El tipo de persona debe ser seleccionado, por favor verificar.");
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }


  validarRegimen()
  {
    let exito = false;
    let ltdocumento= null;

    if( this.regimen == ltdocumento) 
    {
      this.error = ("El tipo de regimen debe ser seleccionado, por favor verificar.");
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }

  validarRazonsocial()
  {
    
    let exito = false;
    /*let regex= new RegExp( /[^a-z][A-Z ]{10,50}/g );*/
    let regex= new RegExp( /^[a-zA-Z.& ]{5,}$/g );

    this.error = '';
    /*
    const tpersona: any  = this.selected;
    console.log("VALIDACIÓN DE RAZON SOCIAL TPERSONA...",tpersona);*/
    
    
    if( regex.test(this.razonsocial) != true ) 
    {
      this.error =  ( "Razón social esta mal escrito o vacio, por favor verificar." );
    } 
    else
    {
      exito = true;
    }
    return exito; 
}

validarPrimernombre()
  {

    let exito = false;
    let regex= new RegExp( /^[a-zA-Z. ]{3,}$/g );
    this.error = '';

    console.log('ANTES DEL IF', this.primernombre);

    
    if( (regex.test(this.primernombre) != true) ) 
    {
      console.log('CUANDO INGRESA AL IF - POR FALLA',this.primernombre);
      this.error =  ( "Primer nombre esta mal escrito o vacio, por favor verificar." );
     } 
    else
    {
      console.log('CUANDO LA VALIDACIÓN ES OK',this.primernombre);
      exito = true;
    }
    return exito; 
  }


    
  validarSegundonombre()
  {

    let exito = false;
    let regex= new RegExp( /^[a-zA-Z. ]{3,}$/g );
    this.error = '';
    
    if( regex.test(this.segundonombre) != true ) 
    {
      this.error =  ( "Segundo nombre esta mal escrito o vacio, por favor verificar." );
    } 
    else
    {
      exito = true;
    }

    return exito; 

  }


  validarPrimerapellido()
  {

    let exito = false;
    let regex= new RegExp( /^[a-zA-Z. ]{3,}$/g );
    this.error = '';
    
    if( regex.test(this.primerapellido) != true ) 
    {
      this.error =  ( "Primer apellido esta mal escrito o vacio, por favor verificar." );
    } 
    else
    {
      exito = true;
    }

    return exito; 

  }


  validarSegundoapellido()
  {

    let exito = false;
    let regex= new RegExp( /^[a-zA-Z. ]{3,}$/g );
    this.error = '';
    
    if( regex.test(this.segundoapellido) != true ) 
    {
      this.error =  ( "Segundo apellido esta mal escrito o vacio, por favor verificar." );
    } 
    else
    {
      exito = true;
    }

    return exito; 

  }

  validarEmail(){

    let exito = false;
    let regex= new RegExp( /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g );

    this.error = '';
    if( regex.test(this.email) != true ) 
    {
      this.error = ("El email esta mal escrito, por favor verificar. ");  
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }


    
  validarCelular()
  {

    let exito = false;
    let regex= new RegExp( /([0-9]){10,14}/g );

    this.error = '';
    if( regex.test(this.celular) != true ) 
    {
      this.error = ( "El celular esta mal escrito, por favor verificar." );
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }



  validarCity()
  {
    let exito = false;
    let vid = 0;
  
    if( this.pselectedCity.id == 'vid') 
    {
      this.error = ("Por favor seleccione la ciudad, por favor verificar.");
    } 
    else
    {
      exito = true;
    }

    return exito; 
  }



 ontipoPersona()
 { 
  /*let tipopersona7 = document.getElementById('tipopersona');*/
  let persona = this.tipopersona7;

  console.log("Tipo persona", persona);
  

 }

 /* Mostrar y ocultar*/

 mostrarOcultar()
 {
    if(this.mostrar){
        this.mostrar=false;
        this.mensaje_enlace='Mostrar';
    }else{
        this.mostrar=true;
        this.mensaje_enlace='Ocultar';
    }

 }

 

 irVerificar()
  {
  
  if (this.ptipopersonaA.id == '1') 
    {
    
        let  rta={} as Rta;
        let mensaje: string;

      
        this.toastService.onShowMessage.emit( "Procesando..." );
    
        this.combuscolfeService.signIn(this.ptipopersonaA.id.toString(), this.razonsocial.toString(), this.primernombre, this.segundonombre, this.primerapellido, this.segundoapellido,this.email, this.email_alternativo_1,this.celular, this.documento, this.tipodocumento,
        this.pselectedDpto.id.toString(), country, this.pselectedCity.id.toString(), tax_level_code, this.regimen, tax_id).subscribe(data=>{
    
        //this.toastService.mensajeHide.emit();         
    
        rta.code = data.codigo;
        rta.msg = data.mensaje;      
          
        console.log("Codigo", rta.code);
        console.log("Mensaje", rta.msg);
        console.log("Valor", rta.val);
        
        
        if (rta.code != 100)
        {
          this.registroExitoso = false;              
          this.toastService.onShowMessage.emit(rta.msg);
          console.log("Mensaje evidenciando el problema",rta.msg);
          //this.continuar();
          //this.registroExitoso = false;  
          
          
        }else
          {
            //this.registroExitoso = true;  
            this.toastService.mensajeHide.emit();
            //this.router.navigate(['/confirmar']);  
            this.actualizarSinin();
            this.router.navigate(['/sigin']);  
          }
    
          console.log("Datos",data.codigo);
          console.log("Datos",data.error);
          console.log("Datos",data.mensaje);
          this.registroExitoso = false;
        
        },
        (error) => 
        {
          // Manejar el error aquí utilizando try-catch
          try {
            throw error;
          } catch (e) {
            console.error('Ocurrió un error:', e);
            return e;
            // Realizar acciones adicionales si es necesario
            //this.registroExitoso = true;
          }
        });
      this.toastService.mensajeHide.emit();  // on september 22
    }  // FIN PRIMER IF TIPO DE PERSONA 1
    

    
    if (this.ptipopersonaA.id == '2') {
      var rta={} as Rta;
          
      this.toastService.onShowMessage.emit( "Procesando..." );

      

      this.combuscolfeService.signIn(this.ptipopersonaA.id.toString(), this.razonsocial, this.primernombre.toString(), this.segundonombre, this.primerapellido.toString(), this.segundoapellido,this.email, this.email_alternativo_1, this.celular, this.documento, this.tipodocumento,
      this.pselectedDpto.id.toString(), country, this.pselectedCity.id.toString(), tax_level_code, this.regimen, tax_id).subscribe(data=>{

      this.toastService.mensajeHide.emit();         

      rta.code = data.codigo;
      rta.msg = data.mensaje;      
        
      console.log("Codigo", rta.code);
      console.log("Mensaje", rta.msg);
      console.log("Valor", rta.val);
        
      if (rta.code != 100){
        this.toastService.onShowMessage.emit(rta.msg);
      }else
        {
          this.router.navigate(['/confirmar']);  
          this.toastService.mensajeHide.emit();
          this.actualizarSinin();
          this.router.navigate(['/sigin']);  
          
        }

        console.log("Datos",data);
    
      
      });
      this.toastService.mensajeHide.emit();  // on september 22
  }
  
}





  actualizarSinin()
  {
    this.documento = '';
    this.confirmardocumento = '';
    this.tipodocumento = '';
    this.ptipopersonaA.id = '';
    this.primernombre = '';
    this.segundonombre = '';
    this.primerapellido = '';
    this.segundoapellido = '';
    this.razonsocial = '';
    this.regimen = '';
    this.email = '';
    this.celular = '';
    this.pselectedDpto.id = '';
    this.pselectedCity.id = '';
    this.email_alternativo_1 = '';
    this.ok = false;
  }
     
}

     

        

  
   
   
   



