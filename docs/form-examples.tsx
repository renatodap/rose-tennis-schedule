/**
 * FORM COMPONENTS SHOWCASE
 *
 * This file demonstrates all the premium form components
 * and their various states and configurations.
 *
 * Use these examples as a reference when building forms.
 */

import { Mail, Lock, User, Search, DollarSign, Calendar, Check, HelpCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox, CheckboxGroup, CheckboxWithLabel } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem, RadioCard, RadioWithLabel } from '@/components/ui/radio-group';
import { FormField } from '@/components/ui/form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ============================================
// INPUT EXAMPLES
// ============================================

export function InputExamples() {
  return (
    <div className="space-y-8 p-8 max-w-2xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">Input Component</h2>

        {/* Basic Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Input</h3>
          <Input placeholder="Enter your email" />
        </div>

        {/* Input with Leading Icon */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">With Leading Icon</h3>
          <Input
            leadingIcon={<Mail className="h-5 w-5" />}
            placeholder="Email address"
          />
          <Input
            leadingIcon={<Lock className="h-5 w-5" />}
            type="password"
            placeholder="Password"
          />
        </div>

        {/* Input with Trailing Icon */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">With Trailing Icon</h3>
          <Input
            trailingIcon={<Search className="h-5 w-5" />}
            placeholder="Search..."
          />
        </div>

        {/* Input with Prefix/Suffix */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">With Prefix/Suffix</h3>
          <Input prefix="$" placeholder="0.00" />
          <Input suffix="USD" placeholder="Amount" />
        </div>

        {/* Clearable Input */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Clearable</h3>
          <Input
            clearable
            placeholder="Type something..."
            onClear={() => console.log('Cleared')}
          />
        </div>

        {/* Input Sizes */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Sizes</h3>
          <Input inputSize="sm" placeholder="Small (36px)" />
          <Input inputSize="default" placeholder="Default (44px)" />
          <Input inputSize="lg" placeholder="Large (52px)" />
        </div>

        {/* Input Variants */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Variants</h3>
          <Input variant="default" placeholder="Default variant" />
          <Input variant="filled" placeholder="Filled variant" />
          <Input variant="outlined" placeholder="Outlined variant" />
        </div>

        {/* Input States */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">States</h3>
          <Input state="default" placeholder="Default state" />
          <Input state="error" placeholder="Error state" />
          <Input state="success" placeholder="Success state" />
          <Input disabled placeholder="Disabled state" />
        </div>
      </section>
    </div>
  );
}

// ============================================
// FORM FIELD EXAMPLES
// ============================================

export function FormFieldExamples() {
  return (
    <div className="space-y-8 p-8 max-w-2xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">Form Field Component</h2>

        {/* Basic Form Field */}
        <FormField label="Email Address" required>
          <Input
            leadingIcon={<Mail className="h-5 w-5" />}
            placeholder="you@example.com"
          />
        </FormField>

        {/* With Error */}
        <FormField
          label="Password"
          required
          error="Password must be at least 8 characters"
        >
          <Input
            leadingIcon={<Lock className="h-5 w-5" />}
            type="password"
            state="error"
          />
        </FormField>

        {/* With Success */}
        <FormField
          label="Username"
          required
          success="Username is available!"
        >
          <Input
            leadingIcon={<User className="h-5 w-5" />}
            state="success"
          />
        </FormField>

        {/* With Hint */}
        <FormField
          label="Bio"
          optional
          hint="Tell us a little bit about yourself"
        >
          <Textarea placeholder="I am a..." />
        </FormField>
      </section>
    </div>
  );
}

// ============================================
// TEXTAREA EXAMPLES
// ============================================

export function TextareaExamples() {
  return (
    <div className="space-y-8 p-8 max-w-2xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">Textarea Component</h2>

        {/* Basic Textarea */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Textarea</h3>
          <Textarea placeholder="Enter your message..." />
        </div>

        {/* With Character Count */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">With Character Count</h3>
          <Textarea
            showCharCount
            maxLength={500}
            placeholder="Max 500 characters"
          />
        </div>

        {/* Auto-resize */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Auto-resize</h3>
          <Textarea
            autoResize
            placeholder="This will grow as you type..."
          />
        </div>

        {/* Variants */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Variants</h3>
          <Textarea variant="default" placeholder="Default" />
          <Textarea variant="filled" placeholder="Filled" />
          <Textarea variant="outlined" placeholder="Outlined" />
        </div>

        {/* States */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">States</h3>
          <Textarea state="error" placeholder="Error state" />
          <Textarea state="success" placeholder="Success state" />
        </div>
      </section>
    </div>
  );
}

// ============================================
// CHECKBOX EXAMPLES
// ============================================

export function CheckboxExamples() {
  return (
    <div className="space-y-8 p-8 max-w-2xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">Checkbox Component</h2>

        {/* Basic Checkbox */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Checkbox</h3>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
              Accept terms and conditions
            </label>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Sizes</h3>
          <div className="flex items-center gap-4">
            <Checkbox size="sm" />
            <Checkbox size="default" />
            <Checkbox size="lg" />
          </div>
        </div>

        {/* Indeterminate */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Indeterminate State</h3>
          <Checkbox indeterminate />
        </div>

        {/* Checkbox with Label */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Checkbox with Label Helper</h3>
          <CheckboxWithLabel
            label="Enable notifications"
            description="Get notified about new matches and events"
          />
        </div>

        {/* Checkbox Group */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Checkbox Group</h3>
          <CheckboxGroup>
            <CheckboxWithLabel label="Option 1" />
            <CheckboxWithLabel label="Option 2" />
            <CheckboxWithLabel label="Option 3" />
          </CheckboxGroup>
        </div>

        {/* Horizontal Group */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Horizontal Group</h3>
          <CheckboxGroup orientation="horizontal">
            <CheckboxWithLabel label="Red" />
            <CheckboxWithLabel label="Green" />
            <CheckboxWithLabel label="Blue" />
          </CheckboxGroup>
        </div>
      </section>
    </div>
  );
}

// ============================================
// RADIO EXAMPLES
// ============================================

export function RadioExamples() {
  return (
    <div className="space-y-8 p-8 max-w-2xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">Radio Component</h2>

        {/* Basic Radio */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Radio</h3>
          <RadioGroup defaultValue="option1">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="option1" id="r1" />
              <label htmlFor="r1" className="text-sm font-medium cursor-pointer">
                Option 1
              </label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="option2" id="r2" />
              <label htmlFor="r2" className="text-sm font-medium cursor-pointer">
                Option 2
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Radio with Label Helper */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">With Label Helper</h3>
          <RadioGroup defaultValue="small">
            <RadioWithLabel value="small" label="Small" description="For personal use" />
            <RadioWithLabel value="medium" label="Medium" description="For small teams" />
            <RadioWithLabel value="large" label="Large" description="For enterprises" />
          </RadioGroup>
        </div>

        {/* Horizontal Layout */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Horizontal Layout</h3>
          <RadioGroup layout="horizontal" defaultValue="yes">
            <RadioWithLabel value="yes" label="Yes" />
            <RadioWithLabel value="no" label="No" />
            <RadioWithLabel value="maybe" label="Maybe" />
          </RadioGroup>
        </div>

        {/* Card Style (RSVP) */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Card Style (Perfect for RSVP)</h3>
          <RadioGroup variant="cards" defaultValue="going">
            <RadioCard
              value="going"
              icon={<Check className="h-5 w-5" />}
              label="Going"
              description="I'll be there"
            />
            <RadioCard
              value="maybe"
              icon={<HelpCircle className="h-5 w-5" />}
              label="Maybe"
              description="Not sure yet"
            />
            <RadioCard
              value="not_going"
              icon={<X className="h-5 w-5" />}
              label="Can't Go"
              description="Won't be able to make it"
            />
          </RadioGroup>
        </div>

        {/* Card Style Horizontal */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Card Style - Horizontal</h3>
          <RadioGroup variant="cards" layout="horizontal" defaultValue="yes">
            <RadioCard value="yes" label="Yes" />
            <RadioCard value="no" label="No" />
          </RadioGroup>
        </div>
      </section>
    </div>
  );
}

// ============================================
// SELECT EXAMPLES
// ============================================

export function SelectExamples() {
  return (
    <div className="space-y-8 p-8 max-w-2xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">Select Component</h2>

        {/* Basic Select */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Select</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* In Form Field */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">In Form Field</h3>
          <FormField label="Skill Level" required>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </section>
    </div>
  );
}

// ============================================
// COMPLETE FORM EXAMPLE
// ============================================

export function CompleteFormExample() {
  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Complete Sign-Up Form</h2>

      <form className="space-y-6">
        {/* Name */}
        <FormField label="Full Name" required>
          <Input
            leadingIcon={<User className="h-5 w-5" />}
            placeholder="John Doe"
          />
        </FormField>

        {/* Email */}
        <FormField label="Email Address" required>
          <Input
            leadingIcon={<Mail className="h-5 w-5" />}
            type="email"
            placeholder="you@example.com"
          />
        </FormField>

        {/* Password */}
        <FormField
          label="Password"
          required
          hint="Must be at least 8 characters"
        >
          <Input
            leadingIcon={<Lock className="h-5 w-5" />}
            type="password"
            placeholder="Create a password"
          />
        </FormField>

        {/* Skill Level */}
        <FormField label="Skill Level" required>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose your level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        {/* Bio */}
        <FormField
          label="Bio"
          optional
          hint="Tell us about your tennis experience"
        >
          <Textarea
            placeholder="I've been playing tennis for..."
            showCharCount
            maxLength={500}
          />
        </FormField>

        {/* Availability */}
        <FormField label="When are you usually available?" optional>
          <CheckboxGroup>
            <CheckboxWithLabel label="Weekday mornings" />
            <CheckboxWithLabel label="Weekday afternoons" />
            <CheckboxWithLabel label="Weekday evenings" />
            <CheckboxWithLabel label="Weekends" />
          </CheckboxGroup>
        </FormField>

        {/* Terms */}
        <FormField>
          <CheckboxWithLabel
            label="I agree to the terms and conditions"
            description="You must accept to continue"
          />
        </FormField>

        {/* Newsletter */}
        <FormField>
          <CheckboxWithLabel
            label="Send me email updates"
            description="Get notified about new matches and events"
          />
        </FormField>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-11 px-4 bg-maroon-700 text-white font-semibold rounded-md hover:bg-maroon-800 transition-colors"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

// ============================================
// RSVP FORM EXAMPLE
// ============================================

export function RsvpFormExample() {
  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Match RSVP</h2>

      <form className="space-y-6">
        {/* RSVP Status */}
        <FormField label="Will you attend?" required>
          <RadioGroup variant="cards">
            <RadioCard
              value="going"
              icon={<Check className="h-5 w-5" />}
              label="Going"
              description="I'll be there"
            />
            <RadioCard
              value="maybe"
              icon={<HelpCircle className="h-5 w-5" />}
              label="Maybe"
              description="Not sure yet"
            />
            <RadioCard
              value="not_going"
              icon={<X className="h-5 w-5" />}
              label="Can't Go"
              description="Won't be able to make it"
            />
          </RadioGroup>
        </FormField>

        {/* Comments */}
        <FormField
          label="Additional Comments"
          optional
          hint="Let the team know if you have any questions or concerns"
        >
          <Textarea
            placeholder="Any comments?"
            autoResize
          />
        </FormField>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-11 px-4 bg-maroon-700 text-white font-semibold rounded-md hover:bg-maroon-800 transition-colors"
        >
          Submit RSVP
        </button>
      </form>
    </div>
  );
}
