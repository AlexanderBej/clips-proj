import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { IClip } from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null
  @Output() update = new EventEmitter<IClip>()

  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Updating clip.'

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  clipID = new FormControl('', { nonNullable: true })

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(private modal: ModalService, private clipService: ClipService) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(!this.activeClip) return

      this.inSubmission = false
      this.showAlert = false
      this.clipID.setValue(this.activeClip.docID!)
      this.title.setValue(this.activeClip.title)
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  async submit() {
    if(!this.activeClip) return
    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip.'

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value)
      
    } catch (error) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong. Please try again later.'
      return 
    }

    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)
    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'

  }

}
