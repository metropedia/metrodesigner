import { Component } from '@angular/core';

@Component({
  selector: 'metro-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent {
  title = 'Metro Designer';
  time = {hour: 13, minute: 30};
}
