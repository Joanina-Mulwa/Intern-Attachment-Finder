import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TooltipConfig } from './tooltip.config';
import { getBsVer } from 'ngx-bootstrap/utils';
import { PlacementForBs5 } from 'ngx-bootstrap/positioning';
import * as i0 from "@angular/core";
import * as i1 from "./tooltip.config";
export class TooltipContainerComponent {
    constructor(config) {
        Object.assign(this, config);
    }
    get _bsVersions() {
        return getBsVer();
    }
    ngAfterViewInit() {
        this.classMap = { in: false, fade: false };
        if (this.placement) {
            if (this._bsVersions.isBs5) {
                this.placement = PlacementForBs5[this.placement];
            }
            this.classMap[this.placement] = true;
        }
        this.classMap[`tooltip-${this.placement}`] = true;
        this.classMap["in"] = true;
        if (this.animation) {
            this.classMap["fade"] = true;
        }
        if (this.containerClass) {
            this.classMap[this.containerClass] = true;
        }
    }
}
TooltipContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: TooltipContainerComponent, deps: [{ token: i1.TooltipConfig }], target: i0.ɵɵFactoryTarget.Component });
TooltipContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.6", type: TooltipContainerComponent, selector: "bs-tooltip-container", host: { attributes: { "role": "tooltip" }, properties: { "class": "\"tooltip in tooltip-\" + placement + \" \" + \"bs-tooltip-\" + placement + \" \" + placement + \" \" + containerClass", "class.show": "!_bsVersions.isBs3", "class.bs3": "_bsVersions.isBs3", "attr.id": "this.id" } }, ngImport: i0, template: `
    <div class="tooltip-arrow arrow"></div>
    <div class="tooltip-inner"><ng-content></ng-content></div>
    `, isInline: true, styles: [":host.tooltip{display:block;pointer-events:none}:host.bs3.tooltip.top>.arrow{margin-left:-2px}:host.bs3.tooltip.bottom{margin-top:0}:host.bs3.bs-tooltip-left,:host.bs3.bs-tooltip-right{margin:0}:host.bs3.bs-tooltip-right .arrow,:host.bs3.bs-tooltip-left .arrow{margin:.3rem 0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: TooltipContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'bs-tooltip-container', changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        '[class]': '"tooltip in tooltip-" + placement + " " + "bs-tooltip-" + placement + " " + placement + " " + containerClass',
                        '[class.show]': '!_bsVersions.isBs3',
                        '[class.bs3]': '_bsVersions.isBs3',
                        '[attr.id]': 'this.id',
                        role: 'tooltip'
                    }, template: `
    <div class="tooltip-arrow arrow"></div>
    <div class="tooltip-inner"><ng-content></ng-content></div>
    `, styles: [":host.tooltip{display:block;pointer-events:none}:host.bs3.tooltip.top>.arrow{margin-left:-2px}:host.bs3.tooltip.bottom{margin-top:0}:host.bs3.bs-tooltip-left,:host.bs3.bs-tooltip-right{margin:0}:host.bs3.bs-tooltip-right .arrow,:host.bs3.bs-tooltip-left .arrow{margin:.3rem 0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.TooltipConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Rvb2x0aXAvdG9vbHRpcC1jb250YWluZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFjLE1BQU0scUJBQXFCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7QUF1QzVELE1BQU0sT0FBTyx5QkFBeUI7SUFXcEMsWUFBWSxNQUFxQjtRQUMvQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBTkQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxRQUFRLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBTUQsZUFBZTtRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUMzQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRTtnQkFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBSSxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQXlDLENBQUMsQ0FBQzthQUNuRjtZQUVELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUN0QztRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQzlCO1FBRUQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUMzQztJQUNILENBQUM7O3NIQWxDVSx5QkFBeUI7MEdBQXpCLHlCQUF5Qix3VkFMMUI7OztLQUdQOzJGQUVRLHlCQUF5QjtrQkFyQ3JDLFNBQVM7K0JBQ0Usc0JBQXNCLG1CQUNmLHVCQUF1QixDQUFDLE1BQU0sUUFFekM7d0JBQ0osU0FBUyxFQUNQLDhHQUE4Rzt3QkFDaEgsY0FBYyxFQUFFLG9CQUFvQjt3QkFDcEMsYUFBYSxFQUFFLG1CQUFtQjt3QkFDbEMsV0FBVyxFQUFFLFNBQVM7d0JBQ3RCLElBQUksRUFBRSxTQUFTO3FCQUNoQixZQXFCUzs7O0tBR1AiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVG9vbHRpcENvbmZpZyB9IGZyb20gJy4vdG9vbHRpcC5jb25maWcnO1xuaW1wb3J0IHsgZ2V0QnNWZXIsIElCc1ZlcnNpb24gfSBmcm9tICduZ3gtYm9vdHN0cmFwL3V0aWxzJztcbmltcG9ydCB7IFBsYWNlbWVudEZvckJzNSB9IGZyb20gJ25neC1ib290c3RyYXAvcG9zaXRpb25pbmcnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdicy10b29sdGlwLWNvbnRhaW5lcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L25vLWhvc3QtbWV0YWRhdGEtcHJvcGVydHlcbiAgaG9zdDoge1xuICAgICdbY2xhc3NdJzpcbiAgICAgICdcInRvb2x0aXAgaW4gdG9vbHRpcC1cIiArIHBsYWNlbWVudCArIFwiIFwiICsgXCJicy10b29sdGlwLVwiICsgcGxhY2VtZW50ICsgXCIgXCIgKyBwbGFjZW1lbnQgKyBcIiBcIiArIGNvbnRhaW5lckNsYXNzJyxcbiAgICAnW2NsYXNzLnNob3ddJzogJyFfYnNWZXJzaW9ucy5pc0JzMycsXG4gICAgJ1tjbGFzcy5iczNdJzogJ19ic1ZlcnNpb25zLmlzQnMzJyxcbiAgICAnW2F0dHIuaWRdJzogJ3RoaXMuaWQnLFxuICAgIHJvbGU6ICd0b29sdGlwJ1xuICB9LFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgOmhvc3QudG9vbHRpcCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIH1cbiAgICA6aG9zdC5iczMudG9vbHRpcC50b3A+LmFycm93IHtcbiAgICAgIG1hcmdpbi1sZWZ0OiAtMnB4O1xuICAgIH1cbiAgICA6aG9zdC5iczMudG9vbHRpcC5ib3R0b20ge1xuICAgICAgbWFyZ2luLXRvcDogMHB4O1xuICAgIH1cbiAgICA6aG9zdC5iczMuYnMtdG9vbHRpcC1sZWZ0LCA6aG9zdC5iczMuYnMtdG9vbHRpcC1yaWdodHtcbiAgICAgIG1hcmdpbjogMHB4O1xuICAgIH1cbiAgICA6aG9zdC5iczMuYnMtdG9vbHRpcC1yaWdodCAuYXJyb3csIDpob3N0LmJzMy5icy10b29sdGlwLWxlZnQgLmFycm93IHtcbiAgICAgIG1hcmdpbjogLjNyZW0gMDtcbiAgICB9XG4gIGBcbiAgXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvdyBhcnJvd1wiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcENvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBjbGFzc01hcD86IHsgW2tleTogc3RyaW5nXTogYm9vbGVhbiB9O1xuICBwbGFjZW1lbnQ/OiBzdHJpbmc7XG4gIGNvbnRhaW5lckNsYXNzPzogc3RyaW5nO1xuICBhbmltYXRpb24/OiBib29sZWFuO1xuICBpZD86IHN0cmluZztcblxuICBnZXQgX2JzVmVyc2lvbnMoKTogSUJzVmVyc2lvbiB7XG4gICAgcmV0dXJuIGdldEJzVmVyKCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFRvb2x0aXBDb25maWcpIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGNvbmZpZyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jbGFzc01hcCA9IHsgaW46IGZhbHNlLCBmYWRlOiBmYWxzZSB9O1xuICAgIGlmICh0aGlzLnBsYWNlbWVudCkge1xuICAgICAgaWYgKHRoaXMuX2JzVmVyc2lvbnMuaXNCczUpIHtcbiAgICAgICAgdGhpcy5wbGFjZW1lbnQgPSAgUGxhY2VtZW50Rm9yQnM1W3RoaXMucGxhY2VtZW50IGFzIGtleW9mIHR5cGVvZiBQbGFjZW1lbnRGb3JCczVdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNsYXNzTWFwW3RoaXMucGxhY2VtZW50XSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMuY2xhc3NNYXBbYHRvb2x0aXAtJHt0aGlzLnBsYWNlbWVudH1gXSA9IHRydWU7XG5cbiAgICB0aGlzLmNsYXNzTWFwW1wiaW5cIl0gPSB0cnVlO1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbikge1xuICAgICAgdGhpcy5jbGFzc01hcFtcImZhZGVcIl0gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRhaW5lckNsYXNzKSB7XG4gICAgICB0aGlzLmNsYXNzTWFwW3RoaXMuY29udGFpbmVyQ2xhc3NdID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==