'use server'
import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import { handleError } from '@/lib/utils'
import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    console.log('Creating user with data:', user);  // Log user data before creating

    const newUser = await User.create(user);

    console.log('User created successfully:', newUser);
    return JSON.parse(JSON.stringify(newUser));  // Ensure response is correctly formatted
  } catch (error) {
    console.error('Error creating user:', error);  // Log any error in user creation
    handleError(error);  // Optionally, handle specific errors
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();
    console.log('Updating user with clerkId:', clerkId, 'and data:', user);  // Log the data being updated

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });

    if (!updatedUser) throw new Error('User update failed');
    
    console.log('User updated successfully:', updatedUser);
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Error updating user:', error);  // Log any error in user update
    handleError(error);
  }
}


export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();
    console.log('Deleting user with clerkId:', clerkId);  // Log the user being deleted

    // Find the user to delete
    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) {
      throw new Error('User not found');
    }

    // Unlink relationships
    await Promise.all([
      // Update 'events' collection to remove user references
      Event.updateMany({ _id: { $in: userToDelete.events } }, { $pull: { organizer: userToDelete._id } }),

      // Update 'orders' collection to remove user references
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ]);

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/');

    if (deletedUser) {
      console.log('User deleted successfully:', deletedUser);
      return JSON.parse(JSON.stringify(deletedUser));
    } else {
      console.error('Failed to delete user');
      return null;
    }
  } catch (error) {
    console.error('Error deleting user:', error);  // Log any error in user deletion
    handleError(error);
  }
}
