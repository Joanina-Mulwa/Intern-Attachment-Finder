import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, Renderer2, ViewChild, ViewChildren, Output, EventEmitter } from '@angular/core';
import { isBs3, Utils } from 'ngx-bootstrap/utils';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { Subscription } from 'rxjs';
import { latinize } from './typeahead-utils';
import { typeaheadAnimation } from './typeahead-animations';
import * as i0 from "@angular/core";
import * as i1 from "ngx-bootstrap/positioning";
import * as i2 from "@angular/common";
let nextWindowId = 0;
export class TypeaheadContainerComponent {
    constructor(positionService, renderer, element, changeDetectorRef) {
        this.positionService = positionService;
        this.renderer = renderer;
        this.element = element;
        this.changeDetectorRef = changeDetectorRef;
        // eslint-disable-next-line @angular-eslint/no-output-rename
        this.activeChangeEvent = new EventEmitter();
        this.isFocused = false;
        this.positionServiceSubscription = new Subscription();
        this.height = 0;
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._matches = [];
        this.renderer.setAttribute(this.element.nativeElement, 'id', this.popupId);
        this.positionServiceSubscription.add(this.positionService.event$?.subscribe(() => {
            if (this.isAnimated) {
                this.animationState = this.isTopPosition ? 'animated-up' : 'animated-down';
                this.changeDetectorRef.detectChanges();
                return;
            }
            this.animationState = 'unanimated';
            this.changeDetectorRef.detectChanges();
        }));
    }
    get isBs4() {
        return !isBs3();
    }
    get typeaheadTemplateMethods() {
        return {
            selectMatch: this.selectMatch.bind(this),
            selectActive: this.selectActive.bind(this),
            isActive: this.isActive.bind(this)
        };
    }
    get active() {
        return this._active;
    }
    set active(active) {
        this._active = active;
        this.activeChanged();
    }
    get matches() {
        return this._matches;
    }
    set matches(value) {
        this.positionService.setOptions({
            modifiers: { flip: { enabled: this.adaptivePosition } },
            allowedPositions: ['top', 'bottom']
        });
        this._matches = value;
        this.needScrollbar = this.typeaheadScrollable && this.typeaheadOptionsInScrollableView < this.matches.length;
        if (this.typeaheadScrollable) {
            setTimeout(() => {
                this.setScrollableMode();
            });
        }
        if (this.typeaheadIsFirstItemActive && this._matches.length > 0) {
            this.setActive(this._matches[0]);
            if (this._active?.isHeader()) {
                this.nextActiveMatch();
            }
        }
        if (this._active && !this.typeaheadIsFirstItemActive) {
            const concurrency = this._matches.find(match => match.value === this._active?.value);
            if (concurrency) {
                this.selectActive(concurrency);
                return;
            }
            this.active = void 0;
        }
    }
    get isTopPosition() {
        return this.element.nativeElement.classList.contains('top');
    }
    get optionsListTemplate() {
        return this.parent ? this.parent.optionsListTemplate : undefined;
    }
    get isAnimated() {
        return this.parent ? this.parent.isAnimated : false;
    }
    get adaptivePosition() {
        return this.parent ? this.parent.adaptivePosition : false;
    }
    get typeaheadScrollable() {
        return this.parent ? this.parent.typeaheadScrollable : false;
    }
    get typeaheadOptionsInScrollableView() {
        return this.parent ? this.parent.typeaheadOptionsInScrollableView : 5;
    }
    get typeaheadIsFirstItemActive() {
        return this.parent ? this.parent.typeaheadIsFirstItemActive : true;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get itemTemplate() {
        return this.parent ? this.parent.typeaheadItemTemplate : undefined;
    }
    get canSelectItemsOnBlur() {
        return !!this.parent?.selectItemOnBlur;
    }
    selectActiveMatch(isActiveItemChanged) {
        if (this._active && this.parent?.typeaheadSelectFirstItem) {
            this.selectMatch(this._active);
        }
        if (!this.parent?.typeaheadSelectFirstItem && isActiveItemChanged) {
            this.selectMatch(this._active);
        }
    }
    activeChanged() {
        if (!this._active) {
            return;
        }
        const index = this.matches.indexOf(this._active);
        this.activeChangeEvent.emit(`${this.popupId}-${index}`);
    }
    prevActiveMatch() {
        if (!this._active) {
            return;
        }
        const index = this.matches.indexOf(this._active);
        this.setActive(this.matches[index - 1 < 0 ? this.matches.length - 1 : index - 1]);
        if (this._active.isHeader()) {
            this.prevActiveMatch();
        }
        if (this.typeaheadScrollable) {
            this.scrollPrevious(index);
        }
    }
    nextActiveMatch() {
        const index = this._active ? this.matches.indexOf(this._active) : -1;
        this.setActive(this.matches[index + 1 > this.matches.length - 1 ? 0 : index + 1]);
        if (this._active?.isHeader()) {
            this.nextActiveMatch();
        }
        if (this.typeaheadScrollable) {
            this.scrollNext(index);
        }
    }
    selectActive(value) {
        this.isFocused = true;
        this.setActive(value);
    }
    highlight(match, query) {
        let itemStr = match.value;
        let itemStrHelper = (this.parent && this.parent.typeaheadLatinize
            ? latinize(itemStr)
            : itemStr).toLowerCase();
        let startIdx;
        let tokenLen;
        // Replaces the capture string with the same string inside of a "strong" tag
        if (typeof query === 'object') {
            const queryLen = query.length;
            for (let i = 0; i < queryLen; i += 1) {
                // query[i] is already latinized and lower case
                startIdx = itemStrHelper.indexOf(query[i]);
                tokenLen = query[i].length;
                if (startIdx >= 0 && tokenLen > 0) {
                    itemStr =
                        `${itemStr.substring(0, startIdx)}<strong>${itemStr.substring(startIdx, startIdx + tokenLen)}</strong>` +
                            `${itemStr.substring(startIdx + tokenLen)}`;
                    itemStrHelper =
                        `${itemStrHelper.substring(0, startIdx)}        ${' '.repeat(tokenLen)}         ` +
                            `${itemStrHelper.substring(startIdx + tokenLen)}`;
                }
            }
        }
        else if (query) {
            // query is already latinized and lower case
            startIdx = itemStrHelper.indexOf(query);
            tokenLen = query.length;
            if (startIdx >= 0 && tokenLen > 0) {
                itemStr =
                    `${itemStr.substring(0, startIdx)}<strong>${itemStr.substring(startIdx, startIdx + tokenLen)}</strong>` +
                        `${itemStr.substring(startIdx + tokenLen)}`;
            }
        }
        return itemStr;
    }
    focusLost() {
        this.isFocused = false;
        if (!this.canSelectItemsOnBlur) {
            this.setActive(void 0);
        }
    }
    isActive(value) {
        return this.active === value;
    }
    selectMatch(value, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.parent?.changeModel(value);
        setTimeout(() => this.parent?.typeaheadOnSelect.emit(value), 0);
        return false;
    }
    setScrollableMode() {
        if (!this.ulElement) {
            this.ulElement = this.element;
        }
        if (this.liElements?.first) {
            const ulStyles = Utils.getStyles(this.ulElement.nativeElement);
            const liStyles = Utils.getStyles(this.liElements.first.nativeElement);
            const ulPaddingBottom = parseFloat((ulStyles['padding-bottom'] ? ulStyles['padding-bottom'] : '')
                .replace('px', ''));
            const ulPaddingTop = parseFloat((ulStyles['padding-top'] ? ulStyles['padding-top'] : '0')
                .replace('px', ''));
            const optionHeight = parseFloat((liStyles.height ? liStyles.height : '0')
                .replace('px', ''));
            const height = this.typeaheadOptionsInScrollableView * optionHeight;
            this.guiHeight = `${height + ulPaddingTop + ulPaddingBottom}px`;
        }
        this.renderer.setStyle(this.element.nativeElement, 'visibility', 'visible');
    }
    scrollPrevious(index) {
        if (index === 0) {
            this.scrollToBottom();
            return;
        }
        if (this.liElements && this.ulElement) {
            const liElement = this.liElements.toArray()[index - 1];
            if (liElement && !this.isScrolledIntoView(liElement.nativeElement)) {
                this.ulElement.nativeElement.scrollTop = liElement.nativeElement.offsetTop;
            }
        }
    }
    scrollNext(index) {
        if (index + 1 > this.matches.length - 1) {
            this.scrollToTop();
            return;
        }
        if (this.liElements && this.ulElement) {
            const liElement = this.liElements.toArray()[index + 1];
            if (liElement && !this.isScrolledIntoView(liElement.nativeElement)) {
                this.ulElement.nativeElement.scrollTop =
                    liElement.nativeElement.offsetTop -
                        Number(this.ulElement.nativeElement.offsetHeight) +
                        Number(liElement.nativeElement.offsetHeight);
            }
        }
    }
    ngOnDestroy() {
        this.positionServiceSubscription.unsubscribe();
    }
    setActive(value) {
        this._active = value;
        let preview;
        if (!(this._active == null || this._active.isHeader())) {
            preview = value;
        }
        this.parent?.typeaheadOnPreview.emit(preview);
    }
    isScrolledIntoView(elem) {
        if (!this.ulElement) {
            return false;
        }
        const containerViewTop = this.ulElement.nativeElement.scrollTop;
        const containerViewBottom = containerViewTop + Number(this.ulElement.nativeElement.offsetHeight);
        const elemTop = elem.offsetTop;
        const elemBottom = elemTop + elem.offsetHeight;
        return ((elemBottom <= containerViewBottom) && (elemTop >= containerViewTop));
    }
    ;
    scrollToBottom() {
        if (!this.ulElement?.nativeElement) {
            return;
        }
        this.ulElement.nativeElement.scrollTop = this.ulElement.nativeElement.scrollHeight;
    }
    scrollToTop() {
        if (!this.ulElement?.nativeElement) {
            return;
        }
        this.ulElement.nativeElement.scrollTop = 0;
    }
}
TypeaheadContainerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: TypeaheadContainerComponent, deps: [{ token: i1.PositioningService }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
TypeaheadContainerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.6", type: TypeaheadContainerComponent, selector: "typeahead-container", outputs: { activeChangeEvent: "activeChange" }, host: { listeners: { "mouseleave": "focusLost()", "blur": "focusLost()" }, properties: { "class.dropdown-menu": "isBs4", "style.height": "isBs4 && needScrollbar ? guiHeight: 'auto'", "style.visibility": "'inherit'", "class.dropup": "dropup", "attr.role": "isBs4 ? 'listbox' : null " }, styleAttribute: "position: absolute;display: block;", classAttribute: "dropdown open bottom" }, viewQueries: [{ propertyName: "ulElement", first: true, predicate: ["ulElement"], descendants: true }, { propertyName: "liElements", predicate: ["liElements"], descendants: true }], ngImport: i0, template: "<!-- inject options list template -->\n<ng-template [ngTemplateOutlet]=\"optionsListTemplate || (isBs4 ? bs4Template : bs3Template)\"\n             [ngTemplateOutletContext]=\"{\n               matches: matches,\n               itemTemplate: itemTemplate || bsItemTemplate,\n               query: query,\n               $implicit: typeaheadTemplateMethods\n             }\">\n</ng-template>\n\n<!-- default options item template -->\n<ng-template #bsItemTemplate let-match=\"match\" let-query=\"query\">\n  <span [innerHtml]=\"highlight(match, query)\"></span>\n</ng-template>\n\n<!-- Bootstrap 3 options list template -->\n<ng-template #bs3Template>\n  <ul class=\"dropdown-menu\"\n      #ulElement\n      role=\"listbox\"\n      [style.overflow-y]=\"needScrollbar ? 'scroll': 'auto'\"\n      [style.height]=\"needScrollbar ? guiHeight: 'auto'\">\n    <ng-template ngFor let-match let-i=\"index\" [ngForOf]=\"matches\">\n      <li #liElements *ngIf=\"match.isHeader()\" class=\"dropdown-header\">{{ match }}</li>\n      <li #liElements\n          *ngIf=\"!match.isHeader()\"\n          [id]=\"popupId + '-' + i\"\n          role=\"option\"\n          [@typeaheadAnimation]=\"animationState\"\n          [class.active]=\"isActive(match)\"\n          (mouseenter)=\"selectActive(match)\">\n\n        <a href=\"#\" (click)=\"selectMatch(match, $event)\" tabindex=\"-1\">\n          <ng-template [ngTemplateOutlet]=\"itemTemplate || bsItemTemplate\"\n                       [ngTemplateOutletContext]=\"{item: match.item, index: i, match: match, query: query}\">\n          </ng-template>\n        </a>\n      </li>\n    </ng-template>\n  </ul>\n</ng-template>\n\n<!-- Bootstrap 4 options list template -->\n<ng-template #bs4Template>\n  <ng-template ngFor let-match let-i=\"index\" [ngForOf]=\"matches\">\n    <h6 *ngIf=\"match.isHeader()\" class=\"dropdown-header\">{{ match }}</h6>\n    <ng-template [ngIf]=\"!match.isHeader()\">\n      <button #liElements\n              [id]=\"popupId + '-' + i\"\n              role=\"option\"\n              [@typeaheadAnimation]=\"animationState\"\n              class=\"dropdown-item\"\n              (click)=\"selectMatch(match, $event)\"\n              (mouseenter)=\"selectActive(match)\"\n              [class.active]=\"isActive(match)\">\n        <ng-template [ngTemplateOutlet]=\"itemTemplate || bsItemTemplate\"\n                     [ngTemplateOutletContext]=\"{item: match.item, index: i, match: match, query: query}\">\n        </ng-template>\n      </button>\n    </ng-template>\n  </ng-template>\n</ng-template>\n", styles: [":host.dropdown{z-index:1000}:host.dropdown-menu,.dropdown-menu{overflow-y:auto;height:100px}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], animations: [typeaheadAnimation] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: TypeaheadContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'typeahead-container', host: {
                        class: 'dropdown open bottom',
                        '[class.dropdown-menu]': 'isBs4',
                        '[style.height]': `isBs4 && needScrollbar ? guiHeight: 'auto'`,
                        '[style.visibility]': `'inherit'`,
                        '[class.dropup]': 'dropup',
                        style: 'position: absolute;display: block;',
                        '[attr.role]': `isBs4 ? 'listbox' : null `
                    }, animations: [typeaheadAnimation], template: "<!-- inject options list template -->\n<ng-template [ngTemplateOutlet]=\"optionsListTemplate || (isBs4 ? bs4Template : bs3Template)\"\n             [ngTemplateOutletContext]=\"{\n               matches: matches,\n               itemTemplate: itemTemplate || bsItemTemplate,\n               query: query,\n               $implicit: typeaheadTemplateMethods\n             }\">\n</ng-template>\n\n<!-- default options item template -->\n<ng-template #bsItemTemplate let-match=\"match\" let-query=\"query\">\n  <span [innerHtml]=\"highlight(match, query)\"></span>\n</ng-template>\n\n<!-- Bootstrap 3 options list template -->\n<ng-template #bs3Template>\n  <ul class=\"dropdown-menu\"\n      #ulElement\n      role=\"listbox\"\n      [style.overflow-y]=\"needScrollbar ? 'scroll': 'auto'\"\n      [style.height]=\"needScrollbar ? guiHeight: 'auto'\">\n    <ng-template ngFor let-match let-i=\"index\" [ngForOf]=\"matches\">\n      <li #liElements *ngIf=\"match.isHeader()\" class=\"dropdown-header\">{{ match }}</li>\n      <li #liElements\n          *ngIf=\"!match.isHeader()\"\n          [id]=\"popupId + '-' + i\"\n          role=\"option\"\n          [@typeaheadAnimation]=\"animationState\"\n          [class.active]=\"isActive(match)\"\n          (mouseenter)=\"selectActive(match)\">\n\n        <a href=\"#\" (click)=\"selectMatch(match, $event)\" tabindex=\"-1\">\n          <ng-template [ngTemplateOutlet]=\"itemTemplate || bsItemTemplate\"\n                       [ngTemplateOutletContext]=\"{item: match.item, index: i, match: match, query: query}\">\n          </ng-template>\n        </a>\n      </li>\n    </ng-template>\n  </ul>\n</ng-template>\n\n<!-- Bootstrap 4 options list template -->\n<ng-template #bs4Template>\n  <ng-template ngFor let-match let-i=\"index\" [ngForOf]=\"matches\">\n    <h6 *ngIf=\"match.isHeader()\" class=\"dropdown-header\">{{ match }}</h6>\n    <ng-template [ngIf]=\"!match.isHeader()\">\n      <button #liElements\n              [id]=\"popupId + '-' + i\"\n              role=\"option\"\n              [@typeaheadAnimation]=\"animationState\"\n              class=\"dropdown-item\"\n              (click)=\"selectMatch(match, $event)\"\n              (mouseenter)=\"selectActive(match)\"\n              [class.active]=\"isActive(match)\">\n        <ng-template [ngTemplateOutlet]=\"itemTemplate || bsItemTemplate\"\n                     [ngTemplateOutletContext]=\"{item: match.item, index: i, match: match, query: query}\">\n        </ng-template>\n      </button>\n    </ng-template>\n  </ng-template>\n</ng-template>\n", styles: [":host.dropdown{z-index:1000}:host.dropdown-menu,.dropdown-menu{overflow-y:auto;height:100px}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.PositioningService }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { activeChangeEvent: [{
                type: Output,
                args: ['activeChange']
            }], ulElement: [{
                type: ViewChild,
                args: ['ulElement', { static: false }]
            }], liElements: [{
                type: ViewChildren,
                args: ['liElements']
            }], focusLost: [{
                type: HostListener,
                args: ['mouseleave']
            }, {
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdHlwZWFoZWFkL3R5cGVhaGVhZC1jb250YWluZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vc3JjL3R5cGVhaGVhZC90eXBlYWhlYWQtY29udGFpbmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBRVosU0FBUyxFQUNULFNBQVMsRUFFVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXBDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUc3QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7OztBQUc1RCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUE4QnJCLE1BQU0sT0FBTywyQkFBMkI7SUF3Q3RDLFlBQ1UsZUFBbUMsRUFDbkMsUUFBbUIsRUFDcEIsT0FBbUIsRUFDbEIsaUJBQW9DO1FBSHBDLG9CQUFlLEdBQWYsZUFBZSxDQUFvQjtRQUNuQyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3BCLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDbEIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQTNDOUMsNERBQTREO1FBQ3BDLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFJL0QsY0FBUyxHQUFHLEtBQUssQ0FBQztRQVNsQixn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LEVBQUUsMkJBQTJCO3FCQUMzQyxjQWFXLENBQUMsa0JBQWtCLENBQUM7MExBS1IsaUJBQWlCO3NCQUF4QyxNQUFNO3VCQUFDLGNBQWM7Z0JBaUNkLFNBQVM7c0JBRGhCLFNBQVM7dUJBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQkFJakMsVUFBVTtzQkFEakIsWUFBWTt1QkFBQyxZQUFZO2dCQStNMUIsU0FBUztzQkFGUixZQUFZO3VCQUFDLFlBQVk7O3NCQUN6QixZQUFZO3VCQUFDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIE9uRGVzdHJveSxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGlzQnMzLCBVdGlscyB9IGZyb20gJ25neC1ib290c3RyYXAvdXRpbHMnO1xuaW1wb3J0IHsgUG9zaXRpb25pbmdTZXJ2aWNlIH0gZnJvbSAnbmd4LWJvb3RzdHJhcC9wb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgbGF0aW5pemUgfSBmcm9tICcuL3R5cGVhaGVhZC11dGlscyc7XG5pbXBvcnQgeyBUeXBlYWhlYWRNYXRjaCB9IGZyb20gJy4vdHlwZWFoZWFkLW1hdGNoLmNsYXNzJztcbmltcG9ydCB7IFR5cGVhaGVhZERpcmVjdGl2ZSB9IGZyb20gJy4vdHlwZWFoZWFkLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyB0eXBlYWhlYWRBbmltYXRpb24gfSBmcm9tICcuL3R5cGVhaGVhZC1hbmltYXRpb25zJztcbmltcG9ydCB7IFR5cGVhaGVhZE9wdGlvbkl0ZW1Db250ZXh0LCBUeXBlYWhlYWRPcHRpb25MaXN0Q29udGV4dCwgVHlwZWFoZWFkVGVtcGxhdGVNZXRob2RzIH0gZnJvbSAnLi9tb2RlbHMnO1xuXG5sZXQgbmV4dFdpbmRvd0lkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAndHlwZWFoZWFkLWNvbnRhaW5lcicsXG4gIHRlbXBsYXRlVXJsOiAnLi90eXBlYWhlYWQtY29udGFpbmVyLmNvbXBvbmVudC5odG1sJyxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9uby1ob3N0LW1ldGFkYXRhLXByb3BlcnR5XG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ2Ryb3Bkb3duIG9wZW4gYm90dG9tJyxcbiAgICAnW2NsYXNzLmRyb3Bkb3duLW1lbnVdJzogJ2lzQnM0JyxcbiAgICAnW3N0eWxlLmhlaWdodF0nOiBgaXNCczQgJiYgbmVlZFNjcm9sbGJhciA/IGd1aUhlaWdodDogJ2F1dG8nYCxcbiAgICAnW3N0eWxlLnZpc2liaWxpdHldJzogYCdpbmhlcml0J2AsXG4gICAgJ1tjbGFzcy5kcm9wdXBdJzogJ2Ryb3B1cCcsXG4gICAgc3R5bGU6ICdwb3NpdGlvbjogYWJzb2x1dGU7ZGlzcGxheTogYmxvY2s7JyxcbiAgICAnW2F0dHIucm9sZV0nOiBgaXNCczQgPyAnbGlzdGJveCcgOiBudWxsIGBcbiAgfSxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgIDpob3N0LmRyb3Bkb3duIHtcbiAgICAgIHotaW5kZXg6IDEwMDA7XG4gICAgfVxuXG4gICAgOmhvc3QuZHJvcGRvd24tbWVudSwgLmRyb3Bkb3duLW1lbnUge1xuICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgIGhlaWdodDogMTAwcHg7XG4gICAgfVxuICBgXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFt0eXBlYWhlYWRBbmltYXRpb25dXG59KVxuXG5leHBvcnQgY2xhc3MgVHlwZWFoZWFkQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9uby1vdXRwdXQtcmVuYW1lXG4gIEBPdXRwdXQoJ2FjdGl2ZUNoYW5nZScpIGFjdGl2ZUNoYW5nZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHBhcmVudD86IFR5cGVhaGVhZERpcmVjdGl2ZTtcbiAgcXVlcnk/OiBzdHJpbmdbXSB8IHN0cmluZztcbiAgaXNGb2N1c2VkID0gZmFsc2U7XG4gIHRvcD86IHN0cmluZztcbiAgbGVmdD86IHN0cmluZztcbiAgZGlzcGxheT86IHN0cmluZztcbiAgcGxhY2VtZW4/OiBzdHJpbmc7XG4gIGRyb3B1cD86IGJvb2xlYW47XG4gIGd1aUhlaWdodD86IHN0cmluZztcbiAgbmVlZFNjcm9sbGJhcj86IGJvb2xlYW47XG4gIGFuaW1hdGlvblN0YXRlPzogc3RyaW5nO1xuICBwb3NpdGlvblNlcnZpY2VTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gIGhlaWdodCA9IDA7XG4gIHBvcHVwSWQgPSBgbmdiLXR5cGVhaGVhZC0ke25leHRXaW5kb3dJZCsrfWA7XG5cbiAgZ2V0IGlzQnM0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhaXNCczMoKTtcbiAgfVxuXG4gIGdldCB0eXBlYWhlYWRUZW1wbGF0ZU1ldGhvZHMoKTogVHlwZWFoZWFkVGVtcGxhdGVNZXRob2RzIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0TWF0Y2g6IHRoaXMuc2VsZWN0TWF0Y2guYmluZCh0aGlzKSxcbiAgICAgIHNlbGVjdEFjdGl2ZTogdGhpcy5zZWxlY3RBY3RpdmUuYmluZCh0aGlzKSxcbiAgICAgIGlzQWN0aXZlOiB0aGlzLmlzQWN0aXZlLmJpbmQodGhpcylcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIF9hY3RpdmU/OiBUeXBlYWhlYWRNYXRjaDtcbiAgcHJvdGVjdGVkIF9tYXRjaGVzOiBUeXBlYWhlYWRNYXRjaFtdID0gW107XG5cbiAgQFZpZXdDaGlsZCgndWxFbGVtZW50JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHByaXZhdGUgdWxFbGVtZW50PzogRWxlbWVudFJlZjtcblxuICBAVmlld0NoaWxkcmVuKCdsaUVsZW1lbnRzJylcbiAgcHJpdmF0ZSBsaUVsZW1lbnRzPzogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcG9zaXRpb25TZXJ2aWNlOiBQb3NpdGlvbmluZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXG4gICkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnaWQnLCB0aGlzLnBvcHVwSWQpO1xuICAgIHRoaXMucG9zaXRpb25TZXJ2aWNlU3Vic2NyaXB0aW9uLmFkZCh0aGlzLnBvc2l0aW9uU2VydmljZS5ldmVudCQ/LnN1YnNjcmliZShcbiAgICAgICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRlZCkge1xuICAgICAgICAgIHRoaXMuYW5pbWF0aW9uU3RhdGUgPSB0aGlzLmlzVG9wUG9zaXRpb24gPyAnYW5pbWF0ZWQtdXAnIDogJ2FuaW1hdGVkLWRvd24nO1xuICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9ICd1bmFuaW1hdGVkJztcbiAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgKSk7XG4gIH1cblxuICBnZXQgYWN0aXZlKCk6IFR5cGVhaGVhZE1hdGNoIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICB9XG5cbiAgc2V0IGFjdGl2ZShhY3RpdmU6IFR5cGVhaGVhZE1hdGNoIHwgdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5fYWN0aXZlID0gYWN0aXZlO1xuICAgIHRoaXMuYWN0aXZlQ2hhbmdlZCgpO1xuICB9XG5cbiAgZ2V0IG1hdGNoZXMoKTogVHlwZWFoZWFkTWF0Y2hbXSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoZXM7XG4gIH1cblxuICBzZXQgbWF0Y2hlcyh2YWx1ZTogVHlwZWFoZWFkTWF0Y2hbXSkge1xuICAgIHRoaXMucG9zaXRpb25TZXJ2aWNlLnNldE9wdGlvbnMoe1xuICAgICAgbW9kaWZpZXJzOiB7IGZsaXA6IHsgZW5hYmxlZDogdGhpcy5hZGFwdGl2ZVBvc2l0aW9uIH0gfSxcbiAgICAgIGFsbG93ZWRQb3NpdGlvbnM6IFsndG9wJywgJ2JvdHRvbSddXG4gICAgfSk7XG5cbiAgICB0aGlzLl9tYXRjaGVzID0gdmFsdWU7XG5cbiAgICB0aGlzLm5lZWRTY3JvbGxiYXIgPSB0aGlzLnR5cGVhaGVhZFNjcm9sbGFibGUgJiYgdGhpcy50eXBlYWhlYWRPcHRpb25zSW5TY3JvbGxhYmxlVmlldyA8IHRoaXMubWF0Y2hlcy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy50eXBlYWhlYWRTY3JvbGxhYmxlKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTY3JvbGxhYmxlTW9kZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZWFoZWFkSXNGaXJzdEl0ZW1BY3RpdmUgJiYgdGhpcy5fbWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnNldEFjdGl2ZSh0aGlzLl9tYXRjaGVzWzBdKTtcblxuICAgICAgaWYgKHRoaXMuX2FjdGl2ZT8uaXNIZWFkZXIoKSkge1xuICAgICAgICB0aGlzLm5leHRBY3RpdmVNYXRjaCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9hY3RpdmUgJiYgIXRoaXMudHlwZWFoZWFkSXNGaXJzdEl0ZW1BY3RpdmUpIHtcbiAgICAgIGNvbnN0IGNvbmN1cnJlbmN5ID0gdGhpcy5fbWF0Y2hlcy5maW5kKG1hdGNoID0+IG1hdGNoLnZhbHVlID09PSB0aGlzLl9hY3RpdmU/LnZhbHVlKTtcblxuICAgICAgaWYgKGNvbmN1cnJlbmN5KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0QWN0aXZlKGNvbmN1cnJlbmN5KTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWN0aXZlID0gdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc1RvcFBvc2l0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvcCcpO1xuICB9XG5cbiAgZ2V0IG9wdGlvbnNMaXN0VGVtcGxhdGUoKTogVGVtcGxhdGVSZWY8VHlwZWFoZWFkT3B0aW9uTGlzdENvbnRleHQ+IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5vcHRpb25zTGlzdFRlbXBsYXRlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IGlzQW5pbWF0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuaXNBbmltYXRlZCA6IGZhbHNlO1xuICB9XG5cbiAgZ2V0IGFkYXB0aXZlUG9zaXRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuYWRhcHRpdmVQb3NpdGlvbiA6IGZhbHNlO1xuICB9XG5cbiAgZ2V0IHR5cGVhaGVhZFNjcm9sbGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudHlwZWFoZWFkU2Nyb2xsYWJsZSA6IGZhbHNlO1xuICB9XG5cbiAgZ2V0IHR5cGVhaGVhZE9wdGlvbnNJblNjcm9sbGFibGVWaWV3KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudHlwZWFoZWFkT3B0aW9uc0luU2Nyb2xsYWJsZVZpZXcgOiA1O1xuICB9XG5cbiAgZ2V0IHR5cGVhaGVhZElzRmlyc3RJdGVtQWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnR5cGVhaGVhZElzRmlyc3RJdGVtQWN0aXZlIDogdHJ1ZTtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBnZXQgaXRlbVRlbXBsYXRlKCk6IFRlbXBsYXRlUmVmPFR5cGVhaGVhZE9wdGlvbkl0ZW1Db250ZXh0PiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudHlwZWFoZWFkSXRlbVRlbXBsYXRlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IGNhblNlbGVjdEl0ZW1zT25CbHVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMucGFyZW50Py5zZWxlY3RJdGVtT25CbHVyO1xuICB9XG5cbiAgc2VsZWN0QWN0aXZlTWF0Y2goaXNBY3RpdmVJdGVtQ2hhbmdlZD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYWN0aXZlICYmIHRoaXMucGFyZW50Py50eXBlYWhlYWRTZWxlY3RGaXJzdEl0ZW0pIHtcbiAgICAgIHRoaXMuc2VsZWN0TWF0Y2godGhpcy5fYWN0aXZlKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyZW50Py50eXBlYWhlYWRTZWxlY3RGaXJzdEl0ZW0gJiYgaXNBY3RpdmVJdGVtQ2hhbmdlZCkge1xuICAgICAgdGhpcy5zZWxlY3RNYXRjaCh0aGlzLl9hY3RpdmUpO1xuICAgIH1cbiAgfVxuXG4gIGFjdGl2ZUNoYW5nZWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLm1hdGNoZXMuaW5kZXhPZih0aGlzLl9hY3RpdmUpO1xuICAgIHRoaXMuYWN0aXZlQ2hhbmdlRXZlbnQuZW1pdChgJHt0aGlzLnBvcHVwSWR9LSR7aW5kZXh9YCk7XG4gIH1cblxuICBwcmV2QWN0aXZlTWF0Y2goKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMubWF0Y2hlcy5pbmRleE9mKHRoaXMuX2FjdGl2ZSk7XG4gICAgdGhpcy5zZXRBY3RpdmUodGhpcy5tYXRjaGVzW1xuICAgICAgaW5kZXggLSAxIDwgMCA/IHRoaXMubWF0Y2hlcy5sZW5ndGggLSAxIDogaW5kZXggLSAxXG4gICAgICBdKTtcblxuICAgIGlmICh0aGlzLl9hY3RpdmUuaXNIZWFkZXIoKSkge1xuICAgICAgdGhpcy5wcmV2QWN0aXZlTWF0Y2goKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50eXBlYWhlYWRTY3JvbGxhYmxlKSB7XG4gICAgICB0aGlzLnNjcm9sbFByZXZpb3VzKGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBuZXh0QWN0aXZlTWF0Y2goKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLl9hY3RpdmUgPyB0aGlzLm1hdGNoZXMuaW5kZXhPZih0aGlzLl9hY3RpdmUpIDogLTE7XG4gICAgdGhpcy5zZXRBY3RpdmUodGhpcy5tYXRjaGVzW1xuICAgICAgaW5kZXggKyAxID4gdGhpcy5tYXRjaGVzLmxlbmd0aCAtIDEgPyAwIDogaW5kZXggKyAxXG4gICAgICBdKTtcblxuICAgIGlmICh0aGlzLl9hY3RpdmU/LmlzSGVhZGVyKCkpIHtcbiAgICAgIHRoaXMubmV4dEFjdGl2ZU1hdGNoKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudHlwZWFoZWFkU2Nyb2xsYWJsZSkge1xuICAgICAgdGhpcy5zY3JvbGxOZXh0KGluZGV4KTtcbiAgICB9XG4gIH1cblxuICBzZWxlY3RBY3RpdmUodmFsdWU6IFR5cGVhaGVhZE1hdGNoKTogdm9pZCB7XG4gICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlO1xuICAgIHRoaXMuc2V0QWN0aXZlKHZhbHVlKTtcbiAgfVxuXG4gIGhpZ2hsaWdodChtYXRjaDogVHlwZWFoZWFkTWF0Y2gsIHF1ZXJ5OiBzdHJpbmdbXSB8IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IGl0ZW1TdHI6IHN0cmluZyA9IG1hdGNoLnZhbHVlO1xuICAgIGxldCBpdGVtU3RySGVscGVyOiBzdHJpbmcgPSAodGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQudHlwZWFoZWFkTGF0aW5pemVcbiAgICAgID8gbGF0aW5pemUoaXRlbVN0cilcbiAgICAgIDogaXRlbVN0cikudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgc3RhcnRJZHg6IG51bWJlcjtcbiAgICBsZXQgdG9rZW5MZW46IG51bWJlcjtcbiAgICAvLyBSZXBsYWNlcyB0aGUgY2FwdHVyZSBzdHJpbmcgd2l0aCB0aGUgc2FtZSBzdHJpbmcgaW5zaWRlIG9mIGEgXCJzdHJvbmdcIiB0YWdcbiAgICBpZiAodHlwZW9mIHF1ZXJ5ID09PSAnb2JqZWN0Jykge1xuICAgICAgY29uc3QgcXVlcnlMZW46IG51bWJlciA9IHF1ZXJ5Lmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVlcnlMZW47IGkgKz0gMSkge1xuICAgICAgICAvLyBxdWVyeVtpXSBpcyBhbHJlYWR5IGxhdGluaXplZCBhbmQgbG93ZXIgY2FzZVxuICAgICAgICBzdGFydElkeCA9IGl0ZW1TdHJIZWxwZXIuaW5kZXhPZihxdWVyeVtpXSk7XG4gICAgICAgIHRva2VuTGVuID0gcXVlcnlbaV0ubGVuZ3RoO1xuICAgICAgICBpZiAoc3RhcnRJZHggPj0gMCAmJiB0b2tlbkxlbiA+IDApIHtcbiAgICAgICAgICBpdGVtU3RyID1cbiAgICAgICAgICAgIGAke2l0ZW1TdHIuc3Vic3RyaW5nKDAsIHN0YXJ0SWR4KX08c3Ryb25nPiR7aXRlbVN0ci5zdWJzdHJpbmcoc3RhcnRJZHgsIHN0YXJ0SWR4ICsgdG9rZW5MZW4pfTwvc3Ryb25nPmAgK1xuICAgICAgICAgICAgYCR7aXRlbVN0ci5zdWJzdHJpbmcoc3RhcnRJZHggKyB0b2tlbkxlbil9YDtcbiAgICAgICAgICBpdGVtU3RySGVscGVyID1cbiAgICAgICAgICAgIGAke2l0ZW1TdHJIZWxwZXIuc3Vic3RyaW5nKDAsIHN0YXJ0SWR4KX0gICAgICAgICR7JyAnLnJlcGVhdCh0b2tlbkxlbil9ICAgICAgICAgYCArXG4gICAgICAgICAgICBgJHtpdGVtU3RySGVscGVyLnN1YnN0cmluZyhzdGFydElkeCArIHRva2VuTGVuKX1gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChxdWVyeSkge1xuICAgICAgLy8gcXVlcnkgaXMgYWxyZWFkeSBsYXRpbml6ZWQgYW5kIGxvd2VyIGNhc2VcbiAgICAgIHN0YXJ0SWR4ID0gaXRlbVN0ckhlbHBlci5pbmRleE9mKHF1ZXJ5KTtcbiAgICAgIHRva2VuTGVuID0gcXVlcnkubGVuZ3RoO1xuICAgICAgaWYgKHN0YXJ0SWR4ID49IDAgJiYgdG9rZW5MZW4gPiAwKSB7XG4gICAgICAgIGl0ZW1TdHIgPVxuICAgICAgICAgIGAke2l0ZW1TdHIuc3Vic3RyaW5nKDAsIHN0YXJ0SWR4KX08c3Ryb25nPiR7aXRlbVN0ci5zdWJzdHJpbmcoc3RhcnRJZHgsIHN0YXJ0SWR4ICsgdG9rZW5MZW4pfTwvc3Ryb25nPmAgK1xuICAgICAgICAgIGAke2l0ZW1TdHIuc3Vic3RyaW5nKHN0YXJ0SWR4ICsgdG9rZW5MZW4pfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1TdHI7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpXG4gIGZvY3VzTG9zdCgpOiB2b2lkIHtcbiAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5jYW5TZWxlY3RJdGVtc09uQmx1cikge1xuICAgICAgdGhpcy5zZXRBY3RpdmUodm9pZCAwKTtcbiAgICB9XG4gIH1cblxuICBpc0FjdGl2ZSh2YWx1ZTogVHlwZWFoZWFkTWF0Y2gpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmUgPT09IHZhbHVlO1xuICB9XG5cbiAgc2VsZWN0TWF0Y2godmFsdWU/OiBUeXBlYWhlYWRNYXRjaCwgZXZlbnQ/OiBFdmVudCk6IGJvb2xlYW4ge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICB0aGlzLnBhcmVudD8uY2hhbmdlTW9kZWwodmFsdWUpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5wYXJlbnQ/LnR5cGVhaGVhZE9uU2VsZWN0LmVtaXQodmFsdWUpLCAwKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHNldFNjcm9sbGFibGVNb2RlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy51bEVsZW1lbnQpIHtcbiAgICAgIHRoaXMudWxFbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxpRWxlbWVudHM/LmZpcnN0KSB7XG4gICAgICBjb25zdCB1bFN0eWxlcyA9IFV0aWxzLmdldFN0eWxlcyh0aGlzLnVsRWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICAgIGNvbnN0IGxpU3R5bGVzID0gVXRpbHMuZ2V0U3R5bGVzKHRoaXMubGlFbGVtZW50cy5maXJzdC5uYXRpdmVFbGVtZW50KTtcbiAgICAgIGNvbnN0IHVsUGFkZGluZ0JvdHRvbSA9IHBhcnNlRmxvYXQoKHVsU3R5bGVzWydwYWRkaW5nLWJvdHRvbSddID8gdWxTdHlsZXNbJ3BhZGRpbmctYm90dG9tJ10gOiAnJylcbiAgICAgICAgLnJlcGxhY2UoJ3B4JywgJycpKTtcbiAgICAgIGNvbnN0IHVsUGFkZGluZ1RvcCA9IHBhcnNlRmxvYXQoKHVsU3R5bGVzWydwYWRkaW5nLXRvcCddID8gdWxTdHlsZXNbJ3BhZGRpbmctdG9wJ10gOiAnMCcpXG4gICAgICAgIC5yZXBsYWNlKCdweCcsICcnKSk7XG4gICAgICBjb25zdCBvcHRpb25IZWlnaHQgPSBwYXJzZUZsb2F0KChsaVN0eWxlcy5oZWlnaHQgPyBsaVN0eWxlcy5oZWlnaHQgOiAnMCcpXG4gICAgICAgIC5yZXBsYWNlKCdweCcsICcnKSk7XG4gICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnR5cGVhaGVhZE9wdGlvbnNJblNjcm9sbGFibGVWaWV3ICogb3B0aW9uSGVpZ2h0O1xuICAgICAgdGhpcy5ndWlIZWlnaHQgPSBgJHtoZWlnaHQgKyB1bFBhZGRpbmdUb3AgKyB1bFBhZGRpbmdCb3R0b219cHhgO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgfVxuXG4gIHNjcm9sbFByZXZpb3VzKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5saUVsZW1lbnRzICYmIHRoaXMudWxFbGVtZW50KSB7XG4gICAgICBjb25zdCBsaUVsZW1lbnQgPSB0aGlzLmxpRWxlbWVudHMudG9BcnJheSgpW2luZGV4IC0gMV07XG4gICAgICBpZiAobGlFbGVtZW50ICYmICF0aGlzLmlzU2Nyb2xsZWRJbnRvVmlldyhsaUVsZW1lbnQubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgICAgdGhpcy51bEVsZW1lbnQubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBsaUVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsTmV4dChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKGluZGV4ICsgMSA+IHRoaXMubWF0Y2hlcy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvVG9wKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGlFbGVtZW50cyAmJiB0aGlzLnVsRWxlbWVudCkge1xuICAgICAgY29uc3QgbGlFbGVtZW50ID0gdGhpcy5saUVsZW1lbnRzLnRvQXJyYXkoKVtpbmRleCArIDFdO1xuICAgICAgaWYgKGxpRWxlbWVudCAmJiAhdGhpcy5pc1Njcm9sbGVkSW50b1ZpZXcobGlFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIHRoaXMudWxFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID1cbiAgICAgICAgICBsaUVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgLVxuICAgICAgICAgIE51bWJlcih0aGlzLnVsRWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCkgK1xuICAgICAgICAgIE51bWJlcihsaUVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucG9zaXRpb25TZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0QWN0aXZlKHZhbHVlPzogVHlwZWFoZWFkTWF0Y2gpOiB2b2lkIHtcbiAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZTtcbiAgICBsZXQgcHJldmlldztcbiAgICBpZiAoISh0aGlzLl9hY3RpdmUgPT0gbnVsbCB8fCB0aGlzLl9hY3RpdmUuaXNIZWFkZXIoKSkpIHtcbiAgICAgIHByZXZpZXcgPSB2YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5wYXJlbnQ/LnR5cGVhaGVhZE9uUHJldmlldy5lbWl0KHByZXZpZXcpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1Njcm9sbGVkSW50b1ZpZXcoZWxlbTogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMudWxFbGVtZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGNvbnRhaW5lclZpZXdUb3A6IG51bWJlciA9IHRoaXMudWxFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgIGNvbnN0IGNvbnRhaW5lclZpZXdCb3R0b20gPSBjb250YWluZXJWaWV3VG9wICsgTnVtYmVyKHRoaXMudWxFbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcbiAgICBjb25zdCBlbGVtVG9wID0gZWxlbS5vZmZzZXRUb3A7XG4gICAgY29uc3QgZWxlbUJvdHRvbSA9IGVsZW1Ub3AgKyBlbGVtLm9mZnNldEhlaWdodDtcblxuICAgIHJldHVybiAoKGVsZW1Cb3R0b20gPD0gY29udGFpbmVyVmlld0JvdHRvbSkgJiYgKGVsZW1Ub3AgPj0gY29udGFpbmVyVmlld1RvcCkpO1xuICB9O1xuXG4gIHByaXZhdGUgc2Nyb2xsVG9Cb3R0b20oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnVsRWxlbWVudD8ubmF0aXZlRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnVsRWxlbWVudC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IHRoaXMudWxFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxUb1RvcCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudWxFbGVtZW50Py5uYXRpdmVFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudWxFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgfVxufVxuIiwiPCEtLSBpbmplY3Qgb3B0aW9ucyBsaXN0IHRlbXBsYXRlIC0tPlxuPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm9wdGlvbnNMaXN0VGVtcGxhdGUgfHwgKGlzQnM0ID8gYnM0VGVtcGxhdGUgOiBiczNUZW1wbGF0ZSlcIlxuICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7XG4gICAgICAgICAgICAgICBtYXRjaGVzOiBtYXRjaGVzLFxuICAgICAgICAgICAgICAgaXRlbVRlbXBsYXRlOiBpdGVtVGVtcGxhdGUgfHwgYnNJdGVtVGVtcGxhdGUsXG4gICAgICAgICAgICAgICBxdWVyeTogcXVlcnksXG4gICAgICAgICAgICAgICAkaW1wbGljaXQ6IHR5cGVhaGVhZFRlbXBsYXRlTWV0aG9kc1xuICAgICAgICAgICAgIH1cIj5cbjwvbmctdGVtcGxhdGU+XG5cbjwhLS0gZGVmYXVsdCBvcHRpb25zIGl0ZW0gdGVtcGxhdGUgLS0+XG48bmctdGVtcGxhdGUgI2JzSXRlbVRlbXBsYXRlIGxldC1tYXRjaD1cIm1hdGNoXCIgbGV0LXF1ZXJ5PVwicXVlcnlcIj5cbiAgPHNwYW4gW2lubmVySHRtbF09XCJoaWdobGlnaHQobWF0Y2gsIHF1ZXJ5KVwiPjwvc3Bhbj5cbjwvbmctdGVtcGxhdGU+XG5cbjwhLS0gQm9vdHN0cmFwIDMgb3B0aW9ucyBsaXN0IHRlbXBsYXRlIC0tPlxuPG5nLXRlbXBsYXRlICNiczNUZW1wbGF0ZT5cbiAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiXG4gICAgICAjdWxFbGVtZW50XG4gICAgICByb2xlPVwibGlzdGJveFwiXG4gICAgICBbc3R5bGUub3ZlcmZsb3cteV09XCJuZWVkU2Nyb2xsYmFyID8gJ3Njcm9sbCc6ICdhdXRvJ1wiXG4gICAgICBbc3R5bGUuaGVpZ2h0XT1cIm5lZWRTY3JvbGxiYXIgPyBndWlIZWlnaHQ6ICdhdXRvJ1wiPlxuICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtbWF0Y2ggbGV0LWk9XCJpbmRleFwiIFtuZ0Zvck9mXT1cIm1hdGNoZXNcIj5cbiAgICAgIDxsaSAjbGlFbGVtZW50cyAqbmdJZj1cIm1hdGNoLmlzSGVhZGVyKClcIiBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiPnt7IG1hdGNoIH19PC9saT5cbiAgICAgIDxsaSAjbGlFbGVtZW50c1xuICAgICAgICAgICpuZ0lmPVwiIW1hdGNoLmlzSGVhZGVyKClcIlxuICAgICAgICAgIFtpZF09XCJwb3B1cElkICsgJy0nICsgaVwiXG4gICAgICAgICAgcm9sZT1cIm9wdGlvblwiXG4gICAgICAgICAgW0B0eXBlYWhlYWRBbmltYXRpb25dPVwiYW5pbWF0aW9uU3RhdGVcIlxuICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiaXNBY3RpdmUobWF0Y2gpXCJcbiAgICAgICAgICAobW91c2VlbnRlcik9XCJzZWxlY3RBY3RpdmUobWF0Y2gpXCI+XG5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiAoY2xpY2spPVwic2VsZWN0TWF0Y2gobWF0Y2gsICRldmVudClcIiB0YWJpbmRleD1cIi0xXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW1UZW1wbGF0ZSB8fCBic0l0ZW1UZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7aXRlbTogbWF0Y2guaXRlbSwgaW5kZXg6IGksIG1hdGNoOiBtYXRjaCwgcXVlcnk6IHF1ZXJ5fVwiPlxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgPC91bD5cbjwvbmctdGVtcGxhdGU+XG5cbjwhLS0gQm9vdHN0cmFwIDQgb3B0aW9ucyBsaXN0IHRlbXBsYXRlIC0tPlxuPG5nLXRlbXBsYXRlICNiczRUZW1wbGF0ZT5cbiAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1tYXRjaCBsZXQtaT1cImluZGV4XCIgW25nRm9yT2ZdPVwibWF0Y2hlc1wiPlxuICAgIDxoNiAqbmdJZj1cIm1hdGNoLmlzSGVhZGVyKClcIiBjbGFzcz1cImRyb3Bkb3duLWhlYWRlclwiPnt7IG1hdGNoIH19PC9oNj5cbiAgICA8bmctdGVtcGxhdGUgW25nSWZdPVwiIW1hdGNoLmlzSGVhZGVyKClcIj5cbiAgICAgIDxidXR0b24gI2xpRWxlbWVudHNcbiAgICAgICAgICAgICAgW2lkXT1cInBvcHVwSWQgKyAnLScgKyBpXCJcbiAgICAgICAgICAgICAgcm9sZT1cIm9wdGlvblwiXG4gICAgICAgICAgICAgIFtAdHlwZWFoZWFkQW5pbWF0aW9uXT1cImFuaW1hdGlvblN0YXRlXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cInNlbGVjdE1hdGNoKG1hdGNoLCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwic2VsZWN0QWN0aXZlKG1hdGNoKVwiXG4gICAgICAgICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiaXNBY3RpdmUobWF0Y2gpXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJpdGVtVGVtcGxhdGUgfHwgYnNJdGVtVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntpdGVtOiBtYXRjaC5pdGVtLCBpbmRleDogaSwgbWF0Y2g6IG1hdGNoLCBxdWVyeTogcXVlcnl9XCI+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICA8L25nLXRlbXBsYXRlPlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==