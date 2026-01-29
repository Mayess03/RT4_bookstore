import { Component, inject, signal, effect, computed } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'
import { ProfilService } from '../services/profil.service'
import { AuthService } from '../../shared/services/auth.service'
import { User } from '../../shared/models/user.model'
import { CommonModule } from '@angular/common'
import { Subject, switchMap, of, EMPTY } from 'rxjs'

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ProfilComponent {
  private profilService = inject(ProfilService)
  private authService = inject(AuthService)
  private router = inject(Router)

  firstName = ''
  lastName = ''
  email = ''

  passwordModel = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  private passwordFormRef: NgForm | null = null

  loadingFlag = signal(false)
  errorMessage = signal('')
  successMessage = signal('')
  passwordChangeSuccess = signal(false)
  showDeleteConfirmation = signal(false)
  deleteConfirmationText = ''

  isAdmin = computed(() => {
    const user = this.authService.getCurrentUser()
    return user?.role?.toUpperCase() === 'ADMIN'
  })

  private profileLoad$ = new Subject<void>()
  private ordersLoad$ = new Subject<void>()
  private profileUpdate$ = new Subject<Partial<User>>()
  private passwordChange$ = new Subject<{ oldPassword: string; newPassword: string }>()
  private accountDelete$ = new Subject<void>()

  profile = toSignal(
    this.profileLoad$.pipe(
      switchMap(() => {
        this.loadingFlag.set(true)
        this.errorMessage.set('')
        return this.profilService.getProfil()
      })
    )
  )

  orders = toSignal(
    this.ordersLoad$.pipe(
      switchMap(() => this.profilService.getOrders())
    )
  )

  profileUpdateResult = toSignal(
    this.profileUpdate$.pipe(
      switchMap((data) => {
        this.loadingFlag.set(true)
        this.errorMessage.set('')
        this.successMessage.set('')
        return this.profilService.updateProfil(data)
      })
    )
  )

  passwordChangeResult = toSignal(
    this.passwordChange$.pipe(
      switchMap((data) => {
        this.loadingFlag.set(true)
        this.errorMessage.set('')
        this.successMessage.set('')
        return this.profilService.changePassword(data)
      })
    )
  )

  accountDeleteResult = toSignal(
    this.accountDelete$.pipe(
      switchMap(() => {
        this.loadingFlag.set(true)
        this.errorMessage.set('')
        return this.profilService.deleteAccount()
      })
    )
  )

  constructor() {
    effect(() => {
      const profileData = this.profile()
      if (profileData) {
        this.firstName = profileData.firstName || ''
        this.lastName = profileData.lastName || ''
        this.email = profileData.email || ''
        this.loadingFlag.set(false)
      }
    })

    effect(() => {
      const result = this.profileUpdateResult()
      if (result) {
        this.firstName = result.firstName || ''
        this.lastName = result.lastName || ''
        this.email = result.email || ''
        this.successMessage.set('Profile updated successfully!')
        this.loadingFlag.set(false)
        setTimeout(() => {
          this.successMessage.set('')
        }, 5000)
      }
    })

    effect(() => {
      const result = this.passwordChangeResult()
      if (result !== undefined) {
        this.passwordChangeSuccess.set(true)
        this.passwordModel = { oldPassword: '', newPassword: '', confirmPassword: '' }

        if (this.passwordFormRef) {
          this.passwordFormRef.resetForm()
        }

        this.loadingFlag.set(false)
        setTimeout(() => {
          this.passwordChangeSuccess.set(false)
        }, 5000)
      }
    })

    effect(() => {
      const result = this.accountDeleteResult()
      if (result !== undefined) {
        this.authService.clearTokens()
        this.router.navigate(['/'])
      }
    })

    effect(() => {
      if (!this.isAdmin()) {
        this.ordersLoad$.next()
      }
    })

    this.profileLoad$.next()
  }

  loading() { return this.loadingFlag() }
  error() { return this.errorMessage() }
  success() { return this.successMessage() }



  saveProfil(form: NgForm) {
    if (form.invalid) return

    const updateData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    }

    this.profileUpdate$.next(updateData)
  }

  changePassword(form: NgForm) {
    if (form.invalid || this.passwordModel.newPassword !== this.passwordModel.confirmPassword) {
      return
    }

    this.passwordFormRef = form

    this.passwordChange$.next({
      oldPassword: this.passwordModel.oldPassword,
      newPassword: this.passwordModel.newPassword
    })
  }

  openDeleteConfirmation() {
    if (this.isAdmin()) {
      this.errorMessage.set('Admin accounts cannot be deleted. Please contact the system administrator.')
      setTimeout(() => this.errorMessage.set(''), 5000)
      return
    }

    this.showDeleteConfirmation.set(true)
    this.deleteConfirmationText = ''
  }

  closeDeleteConfirmation() {
    this.showDeleteConfirmation.set(false)
    this.deleteConfirmationText = ''
  }

  confirmDeleteAccount() {
    if (this.deleteConfirmationText !== 'DELETE') {
      this.errorMessage.set('Please type DELETE to confirm')
      return
    }

    this.accountDelete$.next()
  }
}
