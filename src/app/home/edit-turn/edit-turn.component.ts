import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-turn',
  imports: [],
  templateUrl: './edit-turn.component.html',
  styleUrl: './edit-turn.component.css',
})
export class EditTurnComponent {
  @Input() sessionId!: string;
  @Input() currentDate!: string;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<{id: string, newDate: string}>();
  
  
}
